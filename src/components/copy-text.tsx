"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { openSuccessNotification } from "@/lib/helpers";

interface CopyTextProps {
  text: string | undefined;
}

export function CopyText({ text = "" }: CopyTextProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      openSuccessNotification("Text copied Successfully");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="max-w-xs truncate">{text}</span>
      <button
        type="button"
        onClick={handleCopy}
        className="cursor-pointer border-none bg-transparent p-0"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
