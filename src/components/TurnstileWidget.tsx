import React, { useEffect, useRef } from "react";

type TurnstileWidgetProps = {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact" | "flexible" | "invisible";
  className?: string;
  action?: string;
  cData?: string;
};

export function TurnstileWidget({
  siteKey,
  onVerify,
  onError,
  onExpire,
  theme = "auto",
  size = "flexible",
  className,
  action,
  cData,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<any>(null);

  useEffect(() => {
    let didCancel = false;
    let waitInterval: number | null = null;
    let waitTimeout: number | null = null;

    function renderWidget() {
      if (didCancel) return;
      if (!containerRef.current || !window.turnstile) return;
      try {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            if (!didCancel) onVerify(token);
          },
          "error-callback": () => {
            if (!didCancel) onError?.();
          },
          "expired-callback": () => {
            if (!didCancel) onExpire?.();
          },
          theme,
          size,
          action,
          cData,
        });
      } catch {
        // ignore render errors; onError will be triggered by widget if needed
      }
    }

    if (window.turnstile) {
      renderWidget();
    } else {
      waitInterval = window.setInterval(() => {
        if (window.turnstile) {
          if (waitInterval) window.clearInterval(waitInterval);
          if (waitTimeout) window.clearTimeout(waitTimeout);
          renderWidget();
        }
      }, 50);
      waitTimeout = window.setTimeout(() => {
        if (waitInterval) window.clearInterval(waitInterval);
      }, 10000);
    }

    return () => {
      didCancel = true;
      if (waitInterval) window.clearInterval(waitInterval);
      if (waitTimeout) window.clearTimeout(waitTimeout);
      try {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current);
        }
      } catch {
        // ignore cleanup errors
      }
    };
  }, [siteKey, onVerify, onError, onExpire, theme, size, action, cData]);

  return <div ref={containerRef} className={className} />;
}

export default TurnstileWidget;


