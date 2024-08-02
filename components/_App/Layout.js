import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Layout = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    if (window.paypal) {
      if (window.paypal.use && window.paypal.getElementsByAttribute) {
        window.paypalLogin = window.paypal;
      } else {
        window.paypalPay = window.paypal;
      }
    }

    if (router.asPath.includes("/dashboard/profile-edit/")) {
      if (window.paypalLogin) {
        window.paypal = window.paypalLogin;
      }
    } else if (router.asPath.includes("/dashboard")) {
      if (window.paypalLogin) {
        window.paypal = window.paypalPay;
      }
    }
  }, [router.asPath]);

  return (
    <>
      <Head>
        {/* Required meta tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Indice - Directory & Listing React Next.js Template</title>
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="/images/rent-about-logo.ico"
        />
      </Head>

      {children}
    </>
  );
};

export default Layout;
