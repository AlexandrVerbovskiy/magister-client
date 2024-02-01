import React, { useState, useEffect, useRef, useContext } from "react";
import Link from "next/link";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import RegisterTab from "./RegisterTab";
import LoginTab from "./LoginTab";
import { logout } from "../../../services";
import { IndiceContext } from "../../../contexts";
import { useRouter } from "next/router";

const Navbar = () => {
  // Add active class

  const {
    isAuth,
    onLogout,
    success: mainSuccess,
    isAdmin,
  } = useContext(IndiceContext);

  const [currentPath, setCurrentPath] = useState("");
  const router = useRouter();

  useEffect(() => {
    setCurrentPath(router.asPath);
  }, [router]);

  const isCurrentPath = (link) => {
    if (link.charAt(0) === "/") link = link.slice(1);
    return currentPath.includes("/" + link);
  };

  const [displayAuth, setDisplayAuth] = useState(false);
  const [displayMiniAuth, setDisplayMiniAuth] = useState(false);
  const [sticky, setSticky] = useState(false);

  //sticky menu

  const showStickyMenu = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  if (typeof window !== "undefined") {
    // browser code
    window.addEventListener("scroll", showStickyMenu);
  }

  const toggleAuth = () => {
    setDisplayAuth(!displayAuth);
  };
  const toggleMiniAuth = () => {
    setDisplayMiniAuth(!displayMiniAuth);
  };

  const closeModals = () => {
    setDisplayAuth(false);
    setDisplayMiniAuth(false);
  };

  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    let abortController = new AbortController();
    // your async action is here
    return () => {
      abortController.abort();
    };
  }, []);

  const loginTabBtnTrigger = useRef(null);
  const registerTabBtnTrigger = useRef(null);

  const handleLoginTabActive = () => loginTabBtnTrigger.current.click();
  const handleRegisterTabActive = () => registerTabBtnTrigger.current.click();

  const handleSignOut = () => {
    logout();
    onLogout();
    mainSuccess.set("Successfully logged out");
  };
  return (
    <>
      <div className={displayAuth ? "body_overlay open" : "body_overlay"}></div>
      <div
        className={
          sticky
            ? "is-sticky navbar-area navbar-style-two"
            : "navbar-area navbar-style-two"
        }
      >
        <div className="miran-responsive-nav">
          <div className="container">
            <div className="miran-responsive-menu">
              <div onClick={() => toggleMenu()} className="hamburger-menu">
                {showMenu ? (
                  <i className="bx bx-x"></i>
                ) : (
                  <i className="bx bx-menu"></i>
                )}
              </div>
              <div className="logo">
                <Link href="/">
                  <img src="/images/logo.png" alt="logo" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className={showMenu ? "miran-nav show" : "miran-nav"}>
          <div className="container-fluid">
            <nav className="navbar navbar-expand-md navbar-light">
              <Link href="/" className="navbar-brand">
                <img src="/images/logo.png" alt="logo" />
              </Link>

              <div className="collapse navbar-collapse mean-menu">
                <form className="navbar-search-box search-box-one">
                  <label>
                    <i className="flaticon-search"></i>
                  </label>
                  <input
                    type="text"
                    className="input-search"
                    placeholder="What are you looking for?"
                  />
                </form>

                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link href="/" className="nav-link">
                      Home
                    </Link>
                  </li>

                  {isAdmin && (
                    <li className="nav-item">
                      <Link href="/admin/" className="nav-link">
                        Admin Section
                      </Link>
                    </li>
                  )}
                </ul>

                <div className="others-option d-flex align-items-center">
                  {!isAuth && (
                    <div className="option-item">
                      <span
                        data-toggle="modal"
                        onClick={toggleAuth}
                        className="auth-one"
                      >
                        <i className="flaticon-user"></i> Login / Register
                      </span>
                    </div>
                  )}

                  {isAuth && (
                    <div className="option-item">
                      <span
                        data-toggle="modal"
                        onClick={handleSignOut}
                        className="auth-one"
                      >
                        <i className="bx bx-log-out"></i> Sign out
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </nav>
          </div>
        </div>

        <div className="others-option-for-responsive">
          <div className="container">
            <div className="dot-menu" onClick={toggleMiniAuth}>
              <div className="inner">
                <div className="circle circle-one"></div>
                <div className="circle circle-two"></div>
                <div className="circle circle-three"></div>
              </div>
            </div>

            <div className={displayMiniAuth ? "container active" : "container"}>
              <div className="option-inner">
                <div className="others-option">
                  <div className="option-item">
                    <form className="navbar-search-box">
                      <label>
                        <i className="flaticon-search"></i>
                      </label>
                      <input
                        type="text"
                        className="input-search"
                        placeholder="What are you looking for?"
                      />
                    </form>
                  </div>

                  {!isAuth && (
                    <div className="option-item">
                      <span data-toggle="modal" onClick={toggleAuth}>
                        <i className="flaticon-user"></i> Login / Register
                      </span>
                    </div>
                  )}

                  {isAuth && (
                    <div className="option-item">
                      <span data-toggle="modal" onClick={handleSignOut}>
                        <i className="bx bx-log-out"></i> Sign out
                      </span>
                    </div>
                  )}

                  {/*<div className="option-item">
                    <Link href="/dashboard/add-listing" className="default-btn">
                      <i className="flaticon-more"></i> Add Listing
                    </Link>
                  </div>*/}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------ Auth Modal ------- */}
      {!isAuth && (
        <div
          className={
            displayAuth
              ? "modal loginRegisterModal show"
              : "modal loginRegisterModal"
          }
          id="loginRegisterModal"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <Tabs>
                <button type="button" className="close" onClick={toggleAuth}>
                  <i className="bx bx-x"></i>
                </button>

                <ul className="nav nav-tabs" id="myTab">
                  <TabList>
                    <Tab className="nav-item">
                      <a
                        className="nav-link"
                        id="login-tab"
                        ref={loginTabBtnTrigger}
                      >
                        Login
                      </a>
                    </Tab>
                    <Tab className="nav-item">
                      <a
                        className="nav-link"
                        id="register-tab"
                        ref={registerTabBtnTrigger}
                      >
                        Register
                      </a>
                    </Tab>
                  </TabList>
                </ul>

                <div className="tab-content" id="myTabContent">
                  <TabPanel>
                    <LoginTab
                      moveToRegister={handleRegisterTabActive}
                      closeModal={closeModals}
                    />
                  </TabPanel>

                  <TabPanel>
                    <RegisterTab
                      moveToLogin={handleLoginTabActive}
                      closeModal={closeModals}
                    />
                  </TabPanel>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
