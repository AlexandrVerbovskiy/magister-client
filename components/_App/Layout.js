import Head from "next/head";

const Layout = ({ children, title }) => {
  return (
    <>
      <Head>
        {/* Required meta tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {process.env.NEXT_PUBLIC_PROJECT_MODE == "dev" && (
          <meta name="robots" content="noindex" />
        )}
        <title>{title}</title>
        <link
          rel="shortcut icon"
          type="image/x-icon"
          href="/images/rent-about-logo.ico"
        />
        <meta
          name="description"
          content="Rent and lease tools effortlessly in Warrington and Manchester. RentAbout makes it easy for users to lend and borrow tools with convenience."
        />
        <meta
          name="keywords"
          content="tool rental, tool leasing, rent tools in Warrington, rent tools in Manchester, RentAbout"
        />
      </Head>

      {children}
    </>
  );
};

export default Layout;
