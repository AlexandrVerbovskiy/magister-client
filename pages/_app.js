import React, { useState, useEffect, useRef } from "react";
import { SessionProvider } from "next-auth/react";

import { IndiceProvider } from "../contexts";
import Layout from "../components/_App/Layout";
import Loader from "../components/Shared/Loader";
import MainErrorAlert from "../components/_App/MainErrorAlert";
import MainSuccessAlert from "../components/_App/MainSuccessAlert";
import UnverifiedAlert from "../components/_App/UnverifiedAlert";
import "../styles/index.css";

const useImportGlobalStyle = ({ type, onStart, onEnd }) => {
  const stylesRef = useRef({ base: [], admin: [] });
  const loadedRef = useRef({ base: false, admin: false });
  const isFirstCall = useRef(true);

  const importStyle = async (importFunc, key) => {
    stylesRef.current[key].forEach((elem) =>
      document.querySelector("head").append(elem)
    );

    if (!loadedRef.current[key]) {
      loadedRef.current[key] = true;
      await importFunc();

      document
        .querySelectorAll("head style, head link")
        .forEach((elem) => stylesRef.current[key].push(elem.cloneNode(true)));
    }
  };

  const onChangeType = async () => {
    onStart();

    if (isFirstCall.current) {
      isFirstCall.current = false;

      document
        .querySelectorAll("head style, head link")
        .forEach((elem, index) => {
          if (
            !elem.innerText.includes("MIT License | https://tailwindcss.com") &&
            !elem.hasAttribute("data-n-p")
          ) {
            stylesRef.current["base"].push(elem.cloneNode(true));
          }
        });
    }

    document.querySelectorAll("head style, head link").forEach((elem) => {
      elem.remove();
    });

    if (type == "admin") {
      await importStyle(() => import(`../styles/admin/index.css`), "admin");
    } else {
      await importStyle(() => import(`../styles/index.css`), "base");
    }

    onEnd();
  };

  useEffect(() => {
    onChangeType();
  }, [type]);
};

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);

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
      <IndiceProvider authToken={authToken} userInfo={user} dopProps={{ setLoading }}>
        <Layout>
          <Component {...pageProps} />

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
