import Head from "next/head";
import Script from "next/script";

import Link from "next/link";
import styles from "./layout.module.css";
import CookieConsent from "react-cookie-consent";

export const siteTitle = "World Money";

export default function Layout({
  children,
  home,
}: {
  children: any;
  home?: boolean;
}) {
  return (
    <div className={`${styles.container} max-h-screen`}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="World Money" />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        strategy="lazyOnload"
        onLoad={() =>
          console.log(`script loaded correctly, window.FB has been populated`)
        }
      />

      <main className="flex flex-col items-center">
        {children}
      </main>

      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">← Back to home</Link>
        </div>
      )}

      <CookieConsent
        location="bottom"
        buttonText="Sure"
        style={{ background: "#2B373B" }}
        buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
        expires={365}
      >
        This website uses cookies to enhance the user experience.{" "}
        <span style={{ fontSize: "10px" }}>As everyone else.</span>
      </CookieConsent>
    </div>
  );
}
