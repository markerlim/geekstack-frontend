import App, { AppProps, AppContext } from "next/app";
import { useState, useEffect } from "react";
import "../styles/globals.css";
import { DeviceContext } from "../contexts/DeviceContext";
import { detectDeviceFromUserAgent } from "../services/devices";
import { DeckProvider } from "../contexts/DeckContext";
import { AuthProvider } from "../services/auth/authService";

function MyApp({
  Component,
  pageProps,
}: AppProps & { pageProps: { deviceType?: string } }) {
  // Initialize deviceType with the server-provided value or fallback
  const [deviceType, setDeviceType] = useState(
    pageProps.deviceType || "desktop"
  );

  // On client side, optionally update device type by inspecting userAgent or screen size
  useEffect(() => {
    if (typeof window !== "undefined") {
      // You can run detectDeviceFromUserAgent on client userAgent
      const clientDeviceType = detectDeviceFromUserAgent(
        window.navigator.userAgent
      );
      setDeviceType(clientDeviceType);
    }
  }, []);

  return (
    <DeviceContext.Provider value={deviceType}>
      <AuthProvider>
        <DeckProvider>
          <Component {...pageProps} />
        </DeckProvider>
      </AuthProvider>
    </DeviceContext.Provider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  // This only runs on server side or first load, so safe to read req headers
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
