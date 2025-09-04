import React, { useEffect } from "react";

interface GenericGoogleAdProps {
  className?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

function GenericGoogleAd({ className = "", style = {} }: GenericGoogleAdProps) {
  useEffect(() => {
    if (document.querySelector('script[src*="pagead2.googlesyndication.com"]')) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5722537590677945";
    script.crossOrigin = "anonymous";

    script.onload = () => {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: "block", ...style }}
      data-ad-client="ca-pub-5722537590677945"
      data-ad-slot="6828764971"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}

export default GenericGoogleAd;
