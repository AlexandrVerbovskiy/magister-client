import Head from "next/head";
import env from "../../env";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { IndiceContext } from "../../contexts";

const Layout = ({ children }) => {
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState("");
  const { isAuth } = useContext(IndiceContext);

  useEffect(() => {
    setCurrentPath(router.asPath);
  }, [router]);

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
        {currentPath.includes("/dashboard/orders/") && (
          <script
            src={
              "https://www.paypal.com/sdk/js?client-id=" + env.PAYPAL_CLIENT_ID
            }
            async
          ></script>
        )}
        {(!isAuth || currentPath.includes("/dashboard/profile-edit/")) && (
          <script
            src="https://www.paypalobjects.com/js/external/api.js"
            async
          ></script>
        )}
      </Head>

      {children}
    </>
  );
};

export default Layout;
