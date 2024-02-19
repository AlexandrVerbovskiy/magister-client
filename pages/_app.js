import React, { useState, useEffect, useRef } from "react";
import { SessionProvider } from "next-auth/react";

import { IndiceProvider } from "../contexts";
import Layout from "../components/_App/Layout";
import Loader from "../components/Shared/Loader";
import MainErrorAlert from "../components/_App/MainErrorAlert";
import MainSuccessAlert from "../components/_App/MainSuccessAlert";
import UnverifiedAlert from "../components/_App/UnverifiedAlert";
import "../styles/admin/index.css";

const loadHeadLink = ({ url, rel = "stylesheet", type = "text/css" }) => {
  return new Promise((resolve, reject) => {
    const styleElement = document.createElement("link");
    styleElement.rel = rel;
    styleElement.type = type;
    styleElement.href = url;
    styleElement.onload = resolve;
    styleElement.onerror = reject;
    document.head.appendChild(styleElement);
  });
};

const useImportGlobalStyle = ({ type, onStart, onEnd }) => {
  const adminLinks = useRef([]);
  const isFirstCall = useRef(true);

  const baseStyles = (handleEnd) => {
    const links = [
      {
        url: "https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&amp;display=swap",
      },
      {
        url: "/css/base/bootstrap.min.css",
      },
      {
        url: "/css/base/animate.min.css",
      },
      {
        url: "/css/base/boxicons.min.css",
      },
      {
        url: "/css/base/flaticon.css",
      },
      {
        url: "/css/base/swiper.css",
      },
      {
        url: "/css/base/swiper-bundle.css",
      },
      {
        url: "/css/base/style.css",
      },
      {
        url: "/css/base/responsive.css",
      },
      {
        url: "/css/base/rtl.css",
      },
    ];

    const stylePromises = links.map(loadHeadLink);

    Promise.all(stylePromises)
      .then(function () {
        handleEnd();
      })
      .catch(function (error) {
        console.error("Style loading error:", error);
      });
  };

  const adminStyles = (handleEnd) => {
    adminLinks.current.forEach((link) =>
      document.head.insertAdjacentHTML("beforeend", link)
    );
    handleEnd();
  };

  const onChangeType = async () => {
    onStart();

    if (isFirstCall.current) {
      document.head
        .querySelectorAll("style, link")
        .forEach((elem, index) => adminLinks.current.push(elem.outerHTML));
    }

    console.log(type);

    if (!isFirstCall.current || type != "admin") {
      document.head
        .querySelectorAll("style, link")
        .forEach((elem) => elem.remove());
    }

    const handleEnd = () => {
      isFirstCall.current = false;
      onEnd();
    };

    

    if (type == "admin") {
      if (!isFirstCall.current) {
        adminStyles(handleEnd);
      } else {
        handleEnd();
      }
    }

    if (type != "admin") {
      baseStyles(handleEnd);
    }
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
