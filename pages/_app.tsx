import type { AppProps } from "next/app";
import "../styles/globals.css";
import { DeviceContext } from "../contexts/DeviceContext";

export default function MyApp({
  Component,
  pageProps,
}: AppProps & { pageProps: { deviceType?: string } }) {
  return (
    <DeviceContext.Provider value={pageProps.deviceType || "desktop"}>
      <Component {...pageProps} />
    </DeviceContext.Provider>
  );
}
