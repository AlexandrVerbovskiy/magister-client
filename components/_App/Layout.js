import Head from "next/head";
import env from "../../env";
import { useRouter } from "next/router";
import { useEffect, useLayoutEffect, useState } from "react";

const getPaypalInsertScript = ({ sessionUser, currentPath }) => {
  if (currentPath.includes("/dashboard/profile-edit/")) {
    return "https://www.paypalobjects.com/js/external/api.js";
  } else {
    if (currentPath.includes("/dashboard/")) {
      return "https://www.paypal.com/sdk/js?client-id=" + env.PAYPAL_CLIENT_ID;
    }
  }
};

const Layout = ({ sessionUser, children }) => {
  const router = useRouter();
  const [insertPaypalScript, setInsertPaypalScript] = useState(
    getPaypalInsertScript({ sessionUser, currentPath: router.asPath })
  );

  useLayoutEffect(() => {
    const currentPath = router.asPath;
    setInsertPaypalScript(getPaypalInsertScript({ sessionUser, currentPath }));
  }, [router, sessionUser]);

  useLayoutEffect(() => {
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
    } else {
      if (router.asPath.includes("/dashboard")) {
        if (window.paypalLogin) {
          window.paypal = window.paypalPay;
        }
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
        {insertPaypalScript && <script src={insertPaypalScript} async></script>}
      </Head>

      {children}
    </>
  );
};

export default Layout;
