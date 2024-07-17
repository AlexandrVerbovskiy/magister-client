import Head from "next/head";
import env from "../../env";

const Layout = ({ children }) => {
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
        <script
          src={
            "https://www.paypal.com/sdk/js?client-id=" + env.PAYPAL_CLIENT_ID
          }
          async
        ></script>
        <script
          src="https://www.paypalobjects.com/js/external/api.js"
          async
        ></script>
      </Head>

      {children}
    </>
  );
};

export default Layout;
