import React, { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Mail, Linkedin, Github, Instagram, Facebook } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { FaMedium } from "react-icons/fa";
import { TurnstileWidget } from "./TurnstileWidget";

export function Contact() {
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const siteKey = (import.meta as any).env?.VITE_TURNSTILE_SITE_KEY || "";
  const submitEndpoint =
    (import.meta as any).env?.VITE_CONTACT_WEB_APP_URL || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleError = useCallback(() => {
    setTurnstileToken(null);
  }, []);

  const handleExpire = useCallback(() => {
    setTurnstileToken(null);
  }, []);

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setStatus("idle");
      setErrorMessage(null);

      if (!name.trim() || !email.trim() || !message.trim()) {
        setErrorMessage("Please fill out all fields.");
        return;
      }
      if (!isValidEmail(email)) {
        setErrorMessage("Please enter a valid email address.");
        return;
      }
      if (!turnstileToken) {
        setErrorMessage("Please complete the verification.");
        return;
      }
      if (!submitEndpoint) {
        setErrorMessage("Form is not configured. Missing endpoint.");
        return;
      }

      setIsSubmitting(true);
      try {
        const params = new URLSearchParams();
        params.set("name", name.trim());
        params.set("email", email.trim());
        params.set("message", message.trim());
        params.set("cf-turnstile-response", turnstileToken);
        const submissionId =
          Date.now().toString() + Math.random().toString(36).substring(2, 10);
        params.set("submissionId", submissionId.trim());

        const response = await fetch(submitEndpoint, {
          method: "POST",
          body: params,
          mode: "no-cors",
        });

        if (response && (response.ok || response.type === "opaque")) {
          setStatus("success");
          setName("");
          setEmail("");
          setMessage("");
          setTurnstileToken(null);
          try {
            (window as any).turnstile?.reset();
          } catch {}
        } else {
          setStatus("error");
          setErrorMessage("Submission failed. Please try again later.");
        }
      } catch {
        setStatus("error");
        setErrorMessage("Network error. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [name, email, message, turnstileToken, submitEndpoint]
  );
  return (
    <section className="py-20 bg-gradient-to-b from-[#1E293B] to-[#0F172A] px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            I'm always interested in discussing new opportunities,
            collaborations, and innovative projects. Let's connect!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <h3 className="text-2xl font-semibold text-white mb-6">
              Send a Message
            </h3>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-300 mb-2">Name</label>
                <Input
                  placeholder="Your full name"
                  className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[#3B82F6] focus:ring-[#3B82F6]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Message</label>
                <Textarea
                  placeholder="Tell me about your project or opportunity..."
                  rows={6}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[#3B82F6] focus:ring-[#3B82F6] resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {/* Cloudflare Turnstile */}
              <TurnstileWidget
                siteKey={siteKey}
                onVerify={handleVerify}
                onError={handleError}
                onExpire={handleExpire}
                theme="auto"
                size="flexible"
              />

              <Button
                type="submit"
                disabled={
                  !turnstileToken || isSubmitting || !name || !email || !message
                }
                className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white py-3 transition-all duration-300 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                size="lg"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>

              {status === "success" && (
                <p className="text-green-400 text-sm text-center">
                  Thanks! Your message has been sent.
                </p>
              )}
              {status === "error" && errorMessage && (
                <p className="text-red-400 text-sm text-center">
                  {errorMessage}
                </p>
              )}
            </form>
          </div>

          {/* Contact Info & Social Links */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-semibold text-white mb-6">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[#3B82F6]/20 rounded-lg">
                    <Mail className="w-6 h-6 text-[#3B82F6]" />
                  </div>
                  <div>
                    <p className="text-gray-300">Email</p>
                    <p className="text-white font-medium">
                      naimackerman@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-semibold text-white mb-6">
                Connect With Me
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <a
                  href="https://www.linkedin.com/in/nurahmadkhatim"
                  className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl border border-gray-600 hover:border-[#3B82F6] hover:bg-[#3B82F6]/10 transition-all duration-300 group"
                >
                  <Linkedin className="w-6 h-6 text-[#0A66C2] group-hover:text-[#3B82F6]" />
                  <span className="text-gray-300 group-hover:text-white">
                    LinkedIn
                  </span>
                </a>

                <a
                  href="https://github.com/naimackerman"
                  className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl border border-gray-600 hover:border-[#3B82F6] hover:bg-[#3B82F6]/10 transition-all duration-300 group"
                >
                  <Github className="w-6 h-6 text-gray-300 group-hover:text-[#3B82F6]" />
                  <span className="text-gray-300 group-hover:text-white">
                    GitHub
                  </span>
                </a>

                <a
                  href="https://x.com/naimackerman"
                  className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl border border-gray-600 hover:border-[#3B82F6] hover:bg-[#3B82F6]/10 transition-all duration-300 group"
                >
                  <span className="w-6 h-6 text-gray-300 group-hover:text-[#3B82F6] flex items-center justify-center">
                    <FaXTwitter size={24} />
                  </span>
                  <span className="text-gray-300 group-hover:text-white">
                    X
                  </span>
                </a>

                <a
                  href="https://www.instagram.com/naimackerman"
                  className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl border border-gray-600 hover:border-[#3B82F6] hover:bg-[#3B82F6]/10 transition-all duration-300 group"
                >
                  <Instagram className="w-6 h-6 text-[#E4405F] group-hover:text-[#3B82F6]" />
                  <span className="text-gray-300 group-hover:text-white">
                    Instagram
                  </span>
                </a>

                <a
                  href="https://www.facebook.com/naim319"
                  className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl border border-gray-600 hover:border-[#3B82F6] hover:bg-[#3B82F6]/10 transition-all duration-300 group"
                >
                  <Facebook className="w-6 h-6 text-[#1877F2] group-hover:text-[#3B82F6]" />
                  <span className="text-gray-300 group-hover:text-white">
                    Facebook
                  </span>
                </a>

                <a
                  href="https://medium.com/@naimackerman"
                  className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl border border-gray-600 hover:border-[#3B82F6] hover:bg-[#3B82F6]/10 transition-all duration-300 group"
                >
                  <span className="w-6 h-6 text-gray-300 group-hover:text-[#3B82F6] flex items-center justify-center">
                    <FaMedium size={24} />
                  </span>
                  <span className="text-gray-300 group-hover:text-white">
                    Medium
                  </span>
                </a>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-gradient-to-r from-[#3B82F6]/20 to-[#8B5CF6]/20 backdrop-blur-sm rounded-2xl p-6 border border-[#3B82F6]/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white font-medium">
                  Currently Available
                </span>
              </div>
              <p className="text-gray-300 text-sm">
                Open to new opportunities and collaborations. Typical response
                time: 24-48 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
