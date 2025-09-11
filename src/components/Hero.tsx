import React, { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  const [displayText, setDisplayText] = useState("");
  const [titleIndex, setTitleIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const fullName = "Nur Ahmad Khatim";
  const titles = ["Software Engineer", "AI in Healthcare"];

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const typeNextChar = () => {
      if (currentIndex < fullName.length) {
        setDisplayText(fullName.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutId = setTimeout(typeNextChar, 100);
      } else {
        setIsTypingComplete(true);
      }
    };

    timeoutId = setTimeout(typeNextChar, 500); // Initial delay

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [fullName]);

  useEffect(() => {
    if (!isTypingComplete) return;

    let intervalId: NodeJS.Timeout;

    const rotateTitle = () => {
      setTitleIndex((prevIndex) => (prevIndex + 1) % titles.length);
    };

    intervalId = setInterval(rotateTitle, 3000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isTypingComplete, titles.length]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Simplified animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#3B82F6]/5 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#8B5CF6]/5 rounded-full blur-xl animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Desktop View */}
          <motion.div
            className="flex-1 text-center lg:text-left space-y-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent min-h-[1.2em]">
                {displayText}
                {!isTypingComplete && (
                  <span className="inline-block w-1 h-16 lg:h-20 bg-[#3B82F6] ml-2 animate-pulse" />
                )}
              </h1>
              <div className="h-12 flex items-center justify-center lg:justify-start">
                <h2 className="text-2xl lg:text-3xl text-[#3B82F6] font-medium transition-opacity duration-500">
                  {isTypingComplete ? titles[titleIndex] : "Software Engineer"}
                </h2>
              </div>
              <p className="text-lg text-gray-300 max-w-2xl">
                Love coding, learning new things, and solving problems.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#3B82F6]/25"
                onClick={() => scrollToSection("projects")}
              >
                View Projects
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                onClick={() => scrollToSection("contact")}
              >
                Contact Me
              </Button>
            </div>
          </motion.div>

          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] rounded-full blur-lg opacity-50 scale-110 animate-pulse" />
              <div className="relative transform transition-transform duration-300 hover:scale-105 hover:rotate-2">
                <ImageWithFallback
                  src="/images/foto-naim-3.png"
                  alt="Professional headshot"
                  className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-full object-cover border-4 border-[#3B82F6] shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
