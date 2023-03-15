import Head from "next/head";
import React from "react";

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Chat via XMTP</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      {children}
    </>
  );
};

export default Layout;
