import React, { useState, useEffect } from "react";
import { IndiceProvider } from "../contexts";

import "../styles/bootstrap.min.css";
import "../styles/animate.min.css";
import "../styles/boxicons.min.css";
import "../styles/flaticon.css";
import "swiper/css";
import "swiper/css/bundle";

// Global Style
import "../styles/style.css";
import "../styles/responsive.css";
import "../styles/rtl.css";

import "../styles/admin/style.css";

import Layout from "../components/_App/Layout";
import Loader from "../components/Shared/Loader";

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  const onlyAuthCheck =
    pageProps.access == "auth" || pageProps.access == "admin";

  return (
    <Layout>
      <IndiceProvider onlyAuth={onlyAuthCheck}>
        <Component {...pageProps} />

        <Loader loading={loading} />
      </IndiceProvider>
    </Layout>
  );
}

export default MyApp;
