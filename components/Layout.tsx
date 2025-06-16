import React, { ReactNode } from "react";
import Head from "next/head";
import styles from "../styles/Layout.module.css"
import Navbar from "./navigation/Navbar";
import Sidenav from "./navigation/Sidenav";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "GeekStack" }: Props) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar />
      <div className={styles.pageBody}>
        <Sidenav />
        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
};

export default Layout;
