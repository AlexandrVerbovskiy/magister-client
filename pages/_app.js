import React, { useState, useEffect, useRef } from "react";
import { IndiceProvider } from "../contexts";
import Layout from "../components/_App/Layout";
import Loader from "../components/Shared/Loader";
import MainErrorAlert from "../components/_App/MainErrorAlert";
import MainSuccessAlert from "../components/_App/MainSuccessAlert";
import UnverifiedAlert from "../components/_App/UnverifiedAlert";

import "../styles/index.css";
import PageWrapper from "../components/_App/PageWrapper";

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
        .querySelectorAll("head style")
        .forEach((elem) => stylesRef.current[key].push(elem.cloneNode(true)));
    }
  };

  const onChangeType = async () => {
    onStart();

    if (isFirstCall.current) {
      isFirstCall.current = false;

      document.querySelectorAll("head style").forEach((elem) => {
        if (elem.innerText.includes("MIT License | https://tailwindcss.com")) {
          stylesRef.current["admin"].push(elem.cloneNode(true));
        } else {
          stylesRef.current["base"].push(elem.cloneNode(true));
        }
      });
    }

    document.querySelectorAll("head style").forEach((elem) => elem.remove());

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

  const accessType = pageProps.access;
  const type = pageProps.type;

  useImportGlobalStyle({
    type,
    onStart: () => setLoading(true),
    onEnd: () => setLoading(false),
  });

  return (
    <IndiceProvider access={accessType} dopProps={{ setLoading }}>
      <Layout>
        <PageWrapper>
          <Component {...pageProps} />
        </PageWrapper>

        <Loader loading={loading} />

        <MainErrorAlert />
        <MainSuccessAlert />
        <UnverifiedAlert />
      </Layout>
    </IndiceProvider>
  );
}

export default MyApp;
