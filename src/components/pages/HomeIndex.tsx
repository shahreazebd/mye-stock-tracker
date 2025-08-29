"use client";

import { useCallback, useEffect, useState } from "react";

// Custom hook for copy functionality
const useCopyToClipboard = (text: string) => {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 300);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  }, [text]);

  return { isCopied, copy };
};

// Main component
export default function HomeIndex() {
  useEffect(() => {
    const originalOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const timer = setTimeout(() => {
      document.documentElement.style.overflow = originalOverflow || "auto";
    }, 1000);

    return () => {
      clearTimeout(timer);
      document.documentElement.style.overflow = originalOverflow || "auto";
    };
  }, []);

  return <div></div>;
}
