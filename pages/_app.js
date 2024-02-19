import React, { useState, useEffect, useRef } from "react";
import { SessionProvider } from "next-auth/react";

import { IndiceProvider } from "../contexts";
import Layout from "../components/_App/Layout";
import Loader from "../components/Shared/Loader";
import MainErrorAlert from "../components/_App/MainErrorAlert";
import MainSuccessAlert from "../components/_App/MainSuccessAlert";
import UnverifiedAlert from "../components/_App/UnverifiedAlert";
import "../styles/admin/index.css";

const useImportGlobalStyle = ({ type, onStart, onEnd }) => {
  const adminLinks = useRef([]);
  const isFirstCall = useRef(true);

  const loadStyles = () => [
    `<link rel="stylesheet" href="/css/base/bootstrap.min.css"></link>`,
    `<link rel="stylesheet" href="/css/base/animate.min.css"></link>`,
    `<link rel="stylesheet" href="/css/base/style.css"></link>`,
  ];

  const baseStyles = () => [
    `<link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&amp;display=swap"
  />`,
    `<link rel="stylesheet" href="/css/base/bootstrap.min.css"></link>`,
    `<link rel="stylesheet" href="/css/base/animate.min.css"></link>`,
    `<link rel="stylesheet" href="/css/base/boxicons.min.css"></link>`,
    `<link rel="stylesheet" href="/css/base/flaticon.css"></link>`,
    `<link rel="stylesheet" href="/css/base/swiper.css"></link>`,
    `<link rel="stylesheet" href="/css/base/swiper-bundle.css"></link>`,
    `<link rel="stylesheet" href="/css/base/style.css"></link>`,
    `<link rel="stylesheet" href="/css/base/responsive.css"></link>`,
    `<link rel="stylesheet" href="/css/base/rtl.css"></link>`,
  ];

  const adminStyles = () => adminLinks.current;

  const onChangeType = async () => {
    onStart();

    if (isFirstCall.current) {
      document
        .querySelectorAll("head style, head link")
        .forEach((elem, index) => adminLinks.current.push(elem.outerHTML));
    }

    if (!isFirstCall.current || type != "admin") {
      document
        .querySelectorAll("head style, head link")
        .forEach((elem) => elem.remove());
    }

    let linksToAdd = [];

    if (type == "admin") {
      if (!isFirstCall.current) {
        linksToAdd = adminStyles();
      }
    }

    if (type != "admin") {
      linksToAdd = baseStyles();
    }

    linksToAdd.forEach((link) =>
      document.querySelector("head").insertAdjacentHTML("beforeend", link)
    );

    isFirstCall.current = false;
    setTimeout(onEnd, 10);
  };

  useEffect(() => {
    onChangeType();
  }, [type]);
};

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);

  const pageType = pageProps.pageType;
  const user = pageProps.user;
  const authToken = pageProps.authToken;

  useImportGlobalStyle({
    type: pageType,
    onStart: () => setLoading(true),
    onEnd: () => setLoading(false),
  });

  return (
    <SessionProvider>
      <IndiceProvider
        authToken={authToken}
        userInfo={user}
        dopProps={{ setLoading }}
      >
        <Layout>
          {!loading && <Component {...pageProps} />}

          <Loader loading={loading} />

          <MainErrorAlert {...pageProps} />
          <MainSuccessAlert {...pageProps} />
          <UnverifiedAlert {...pageProps} />
        </Layout>
      </IndiceProvider>
    </SessionProvider>
  );
}

export default MyApp;
