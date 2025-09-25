"use client";

import React, { useState } from "react";

export const ShareUrlButton: React.FC = () => {
  const [showToast, setShowToast] = useState(false);

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
      document.execCommand('copy');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('Could not copy URL to clipboard', err);
    }

    document.body.removeChild(textArea);
  };

  function handleShareUrl(){
    const currentUrl = window.location.href;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl).then(() => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      }).catch(() => {
        fallbackCopyToClipboard(currentUrl);
      });
    } else {
      fallbackCopyToClipboard(currentUrl);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleShareUrl}
        className="bg-background-alt hover:bg-background border text-secondary-text font-medium px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-200 flex items-center gap-2 text-sm cursor-pointer"
        aria-label="Share current URL with filters"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
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