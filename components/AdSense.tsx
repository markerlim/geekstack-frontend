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
    // Check if script already exists to avoid duplicates
    if (
      document.querySelector('script[src*="pagead2.googlesyndication.com"]')
    ) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      return;
    }

    // Load the Google AdSense script
    const script = document.createElement("script");
    script.async = true;
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5722537590677945";
    script.crossOrigin = "anonymous";

    // Push the ad once the script is loaded
    script.onload = () => {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    };

    document.head.appendChild(script);

    return () => {
      // Clean up the script when the component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: "block", minWidth: "250px", ...style }}
      data-ad-format="fluid"
      data-ad-layout-key="-fb+5w+4e-db+86"
      data-ad-client="ca-pub-5722537590677945"
      data-ad-slot="1635710053"
    />
  );
}

export default GenericGoogleAd;
