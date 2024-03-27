import React, { useState, useLayoutEffect, useRef } from "react";
import { SessionProvider } from "next-auth/react";

import { IndiceProvider } from "../contexts";
import Layout from "../components/_App/Layout";
import Loader from "../components/Shared/Loader";
import GlobalError from "../components/GlobalError/ErrorContent";
import MainErrorAlert from "../components/_App/MainErrorAlert";
import MainSuccessAlert from "../components/_App/MainSuccessAlert";
import UnverifiedAlert from "../components/_App/UnverifiedAlert";
import "../styles/index.css";

const styleSelector = "head style, head link:not([rel='shortcut icon']";

const useImportGlobalStyle = ({ type, onStart, onEnd }) => {
  const stylesRef = useRef({ base: [], admin: [] });
  const loadedRef = useRef({ base: false, admin: false });
  const isFirstCall = useRef(true);

  const importStyle = async (importFuncs, key, isFirst) => {
    stylesRef.current[key].forEach((elem) =>
      document.querySelector("head").append(elem)
    );

    if (!loadedRef.current[key]) {
      loadedRef.current[key] = true;

      for (let i = 0; i < importFuncs.length; i++) {
        await importFuncs[i]();
      }

      document
        .querySelectorAll(styleSelector)
        .forEach((elem) => stylesRef.current[key].push(elem.cloneNode(true)));
    }
  };

  const onChangeType = async () => {
    onStart();

    const isFirst = isFirstCall.current;

    if (isFirstCall.current) {
      isFirstCall.current = false;

      document.querySelectorAll(styleSelector).forEach((elem, index) => {
        if (
          !elem.innerText.includes("MIT License | https://tailwindcss.com") &&
          !elem.hasAttribute("data-n-p")
        ) {
          stylesRef.current["base"].push(elem.cloneNode(true));
        }
      });
    }

    document.querySelectorAll(styleSelector).forEach((elem) => {
      elem.remove();
    });

    if (type == "admin") {
      await importStyle(
        [
          () => import(`../styles/admin/main.css`),
          () => import(`../styles/admin/utility-patterns.css`),
          () => import(`../styles/admin/flatpickr.css`),
          () => import(`../styles/admin/dop.css`),
        ],
        "admin"
      );
    } else {
      await importStyle([() => import(`../styles/index.css`)], "base");
    }

    if (!isFirst) {
      setTimeout(onEnd, 500);
    } else {
      onEnd();
    }
  };

  useLayoutEffect(() => {
    onChangeType();
  }, [type]);
};

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);

  const pageType = pageProps.pageType;
  const sessionUser = pageProps.sessionUser;
  const authToken = pageProps.authToken;
  const categories = pageProps.categories ?? {};
  const globalError = pageProps.globalError ?? null;

  useImportGlobalStyle({
    type: pageType,
    onStart: () => setLoading(true),
    onEnd: () => {
      setLoading(false)
    },
  });

  if (globalError) {
    return (
      <GlobalError status={globalError.status} message={globalError.message} />
    );
  }

  return (
    <SessionProvider>
      <IndiceProvider
        authToken={authToken}
        userInfo={sessionUser}
        dopProps={{ setLoading }}
        categories={categories}
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
