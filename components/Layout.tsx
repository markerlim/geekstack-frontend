import React, { ReactNode } from "react";
import Head from "next/head";
import styles from "../styles/Layout.module.css";
import Navbar from "./navigation/Navbar";
import Sidenav from "./navigation/Sidenav";
import Bottomnav from "./navigation/Bottomnav";
import { useDevice } from "../contexts/DeviceContext";

type Props = {
  scrollable?: boolean;
  children?: ReactNode;
  title?: string;
};

const Layout = ({ scrollable = true, children, title = "GeekStack" }: Props) => {
  const deviceType = useDevice();

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar />
      <div className={`${styles.pageBody} ${deviceType === "desktop" ? styles.pageBodyDesktop:styles.pageBodyMobile}`}>
        {deviceType === "desktop" ? <Sidenav /> : <Bottomnav />}
        <main
          className={`${styles.mainContent} ${
            scrollable ? styles.scrollable : styles.notScrollable
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
