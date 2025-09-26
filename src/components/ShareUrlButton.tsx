"use client";

import React, { useCallback, useState } from "react";
import { FaShare } from "react-icons/fa";

/**
 * The Share URL Button.
 * @returns The Share URL Button as a React Component.
 */
export const ShareUrlButton: React.FC = () => {
  const [showToast, setShowToast] = useState(false);

  /**
   * Uses a different approach to copy to clipboard.
   * @param text The text to copy.
   */
  const fallbackCopyToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error("Could not copy URL to clipboard", err);
    }

    document.body.removeChild(textArea);
  };

  /**
   * handles clicking on the share URL button.
   */
  const handleShareUrl = useCallback(() => {
    const currentUrl = window.location.href;
    
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(currentUrl)
        .then(() => {
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2000);
        })
        .catch(() => {
          fallbackCopyToClipboard(currentUrl);
        });
      } else {
        fallbackCopyToClipboard(currentUrl);
      }
    }, [fallbackCopyToClipboard])

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleShareUrl}
        className="bg-background-alt hover:bg-background border text-secondary-text font-medium px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-200 flex items-center gap-2 text-sm cursor-pointer"
        aria-label="Share current URL with filters"
      >
        <FaShare />
        URL teilen
      </button>

      {showToast && (
        <div
          role="status"
          aria-live="polite"
          className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap shadow-lg"
        >
          URL in Zwischenablage kopiert!
        </div>
      )}
    </div>
  );
};
