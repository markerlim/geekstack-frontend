import { Heart } from "lucide-react";
import React, { useEffect, useState } from "react";

interface GenericGoogleAdProps {
  className?: string;
  style?: React.CSSProperties;
  fallbackHeight?: number; // height for blank placeholder
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

function GenericGoogleAd({
  className = "",
  style = {},
  fallbackHeight = 100, // default height for placeholder
}: GenericGoogleAdProps) {
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    const loadAd = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdLoaded(true);
      } catch (err) {
        console.warn("Adsense failed to load:", err);
        setAdLoaded(false);
      }
    };

    if (document.querySelector('script[src*="pagead2.googlesyndication.com"]')) {
      loadAd();
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5722537590677945";
    script.crossOrigin = "anonymous";

    script.onload = loadAd;

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return adLoaded ? (
    <ins
      className={`adsbygoogle ${className}`}
      style={{display: "block",margin:"10px 0px",...style}}
      data-ad-client="ca-pub-5722537590677945"
      data-ad-slot="6828764971"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  ) : (
    <></>
  );
}

export default GenericGoogleAd;
