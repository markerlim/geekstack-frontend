import App, { AppProps, AppContext } from "next/app";
import { useState, useEffect } from "react";
import Head from "next/head";
import "../styles/globals.css";
import { DeviceContext } from "../contexts/DeviceContext";
import { detectDeviceFromUserAgent } from "../utils/DetectDevice";
import { DeckProvider } from "../contexts/DeckContext";
import { AuthProvider } from "../services/auth";

function MyApp({
  Component,
  pageProps,
}: AppProps & { pageProps: { deviceType?: string } }) {
  // Initialize deviceType with the server-provided value or fallback
  const [deviceType, setDeviceType] = useState(
    pageProps.deviceType || "desktop"
  );

  // PWA Service Worker Registration
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Device detection
      const clientDeviceType = detectDeviceFromUserAgent(
        window.navigator.userAgent
      );
      setDeviceType(clientDeviceType);

      // Register service worker in production
      if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js').then(
            registration => console.log('SW registered: ', registration),
            err => console.log('SW registration failed: ', err)
          );
        });
      }
    }
  }, []);

  return (
    <>
      <Head>
        <meta name="application-name" content="Geekstack" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Geekstack" />
        <meta name="description" content="One stop app for trading card content!" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#1d1d1d" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      
      <DeviceContext.Provider value={deviceType}>
        <AuthProvider>
          <DeckProvider>
            <Component {...pageProps} />
          </DeckProvider>
        </AuthProvider>
      </DeviceContext.Provider>
    </>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  const userAgent = appContext.ctx.req?.headers["user-agent"];
  const deviceType = detectDeviceFromUserAgent(userAgent);

  return {
    ...appProps,
    pageProps: {
      ...appProps.pageProps,
      deviceType,
    },
  };
};

export default MyApp;