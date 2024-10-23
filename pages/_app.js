import React, { useState, useRef } from "react";
import { SessionProvider } from "next-auth/react";

import { IndiceProvider } from "../contexts";
import Layout from "../components/_App/Layout";
import Loader from "../components/Shared/Loader";
import GlobalError from "../components/GlobalError/ErrorContent";
import MainErrorAlert from "../components/_App/MainErrorAlert";
import MainSuccessAlert from "../components/_App/MainSuccessAlert";
import "../styles/index.css";
import { useIsomorphicLayoutEffect, useSocketInit } from "../hooks";
import CookieBanner from "../components/_App/CookieAlert";

const styleSelector = "head style, head link:not([rel='shortcut icon']";

const useImportGlobalStyle = ({ type, onStart, onEnd }) => {
  const stylesRef = useRef({ base: [], admin: [] });
  const loadedRef = useRef({ base: false, admin: false });
  const isFirstCall = useRef(true);

  const importStyle = async (importFuncs, key) => {
    stylesRef.current[key].forEach((elem) =>
      document.querySelector("head").append(elem)
    );

    if (!loadedRef.current[key]) {
      loadedRef.current[key] = true;

      for (let i = 0; i < importFuncs.length; i++) {
        await importFuncs[i]();
      }

      document.querySelectorAll(styleSelector).forEach((elem) => {
        key.split(" ").forEach((subKey) => elem.classList.add(subKey));
        const clonedElement = elem.cloneNode(true);
        stylesRef.current[key].push(clonedElement);
      });
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
          elem.classList.add("base");
          const clonedElement = elem.cloneNode(true);
          stylesRef.current["base"].push(clonedElement);
        }
      });
    }

    let currentStyleType = "base";

    if (isFirst) {
      currentStyleType = "base";
    } else {
      if (type == "admin") {
        currentStyleType = "base";
      } else {
        currentStyleType = "admin";
      }
    }

    document.querySelectorAll(styleSelector).forEach((elem) => {
      if (!elem.classList.contains(currentStyleType)) {
        elem.classList.add(currentStyleType);
        const clonedElement = elem.cloneNode(true);
        stylesRef.current[currentStyleType].push(clonedElement);
      }

      elem.remove();
    });

    if (type == "admin") {
      await importStyle(
        [
          () => import(`flatpickr/dist/flatpickr.min.css?type=admin`),
          () => import(`../styles/admin/main.css`),
          () => import(`../styles/admin/utility-patterns.css`),
          () => import(`../styles/admin/dop.css`),
          () => import(`../styles/admin/flatpickr.css`),
          () => import(`../styles/admin/flaticon.css`),
        ],
        "admin"
      );
    } else {
      await importStyle(
        [
          () => import(`flatpickr/dist/flatpickr.min.css?type=base`),
          () => import(`../styles/index.css`),
          () => import(`../styles/flatpickr.css`),
          () => import(`../styles/flaticon.css`),
        ],
        "base"
      );
    }

    if (!isFirst) {
      setTimeout(onEnd, 500);
    } else {
      onEnd();
    }
  };

  useIsomorphicLayoutEffect(() => {
    onChangeType();
  }, [type]);
};

function MyApp({ Component, pageProps }) {
  const [scriptLoading, setScriptLoading] = useState(true);

  const pageType = pageProps.pageType;
  const pageTitle = pageProps.pageTitle ?? "DressRenter";
  const sessionUser = pageProps.sessionUser;
  const authToken = pageProps.authToken;
  const categories = pageProps.categories ?? {};
  const globalError = pageProps.globalError ?? null;
  const basePageLoading = pageProps.pageLoading ?? false;

  const [pageLoading, setPageLoading] = useState(basePageLoading);

  const io = useSocketInit({ authToken });

  useImportGlobalStyle({
    type: pageType,
    onStart: () => setScriptLoading(true),
    onEnd: () => {
      setScriptLoading(false);
    },
  });

  useTawkScript(pageType);

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
        dopProps={{ setLoading: setPageLoading }}
        categories={categories}
        io={io}
      >
        <Layout title={pageTitle}>
          {!scriptLoading && <Component {...pageProps} />}

          <Loader loading={scriptLoading || pageLoading} />

          <div className="message-site-warning-alert-list">
            {pageType != "admin" && <CookieBanner />}
          </div>

          <div className="message-site-success-alert-list">
            <MainErrorAlert {...pageProps} />
            <MainSuccessAlert {...pageProps} />
          </div>
        </Layout>
      </IndiceProvider>
    </SessionProvider>
  );
}

export default MyApp;
