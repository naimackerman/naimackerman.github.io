declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          'error-callback'?: () => void;
          'expired-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact' | 'flexible' | 'invisible';
          appearance?: 'always' | 'execute' | 'interaction-only';
          action?: string;
          cData?: string;
          retry?: 'auto' | 'never';
          retryInterval?: number;
        }
      ) => any;
      reset: (widgetId?: any) => void;
      remove: (widgetId: any) => void;
    };
  }
}

export {};


