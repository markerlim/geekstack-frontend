import React, { ReactNode } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
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
  const router = useRouter();
const hideNavbarPaths = ["/deckbuilder", "/stacks"];
const shouldHideNavbar = 
  deviceType !== "desktop" && 
  hideNavbarPaths.some(path => router.pathname.includes(path));

  const hideValue = (deviceType !== "desktop" && shouldHideNavbar)
  return (
    <div>
      {/* Show Navbar unless: on mobile AND in deckbuilder route */}
      {!hideValue && <Navbar />}
      <div className={`${styles.pageBody} ${deviceType === "desktop" ? styles.pageBodyDesktop : !hideValue ? styles.pageBodyMobileWithTopNav : styles.pageBodyMobileNoTop}`}>
        {/* Always show Sidenav/Bottomnav based on device */}
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