import Head from "next/head";

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        {/* Required meta tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>RentAbout</title>
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="/images/rent-about-logo.ico"
        />
        <meta name="description" content="RentAbout is a great site"/>
        <meta name="keywords" content="RentAbout"/>
      </Head>

      {children}
    </>
  );
};

export default Layout;
