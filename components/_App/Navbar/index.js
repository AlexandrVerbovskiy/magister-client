import React, { useState, useEffect, useRef, useContext } from "react";
import Link from "next/link";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import RegisterTab from "./RegisterTab";
import LoginTab from "./LoginTab";
import { generateTwoFactorCode, checkTwoFactorCode } from "../../../services";
import { IndiceContext } from "../../../contexts";
import { useRouter } from "next/router";
import AuthCodeModal from "./AuthCodeModal";
import AuthTypeModal from "./AuthTypeModal";
import Cookies from "js-cookie";
import env from "../../../env";

const Navbar = () => {
  const {
    isAuth,
    onLogout,
    success: mainSuccess,
    isSupport,
    onLogin,
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
    setLoginEmail("");
    setLoginPassword("");
    setLoginRememberMe(false);
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

  const loginTabBtnTrigger = useRef(null);
  const registerTabBtnTrigger = useRef(null);

  const handleLoginTabActive = () => loginTabBtnTrigger.current.click();
  const handleRegisterTabActive = () => registerTabBtnTrigger.current.click();

  const handleSignOut = () => {
    Cookies.remove("auth-token");
    onLogout();
    mainSuccess.set("Successfully logged out");
  };

  const [userToAuth, setUserToAuth] = useState(null);

  const [canChangeType, setCanChangeType] = useState(false);
  const [type, setType] = useState("email");
  const [typeModalActive, setTypeModalActive] = useState(false);
  const [typeModalError, setTypeModalError] = useState(null);

  const [code, setCode] = useState("");
  const [codeModalActive, setCodeModalActive] = useState(false);
  const [codeModalError, setCodeModalError] = useState(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [loginRememberMe, setLoginRememberMe] = useState(false);

  const handleChangeCode = (e) => {
    setCode(e.target.value);
    setCodeModalError(null);
  };

  const handleSelectTypeClick = async (type) => {
    setType(type);

    try {
      await generateTwoFactorCode(loginEmail, loginPassword, type);
      setTypeModalActive(false);
      setCodeModalActive(true);
    } catch (e) {
      setTypeModalError(e.message);
    }
  };

  const handleCheckCode = async () => {
    if (code.length < 1) {
      setCodeModalError("Code is required field");
    }

    try {
      const res = await checkTwoFactorCode(
        type,
        code,
        userToAuth.id,
        loginRememberMe
      );

      let expirationDate = new Date();

      const dopDays = loginRememberMe
        ? env.REMEMBER_COOKIES_DAYS
        : env.NORMAL_COOKIES_DAYS;
      expirationDate.setDate(expirationDate.getDate() + dopDays);


      Cookies.set("auth-token", res.accessToken, {
        expires: expirationDate,
      });

      onLogin(res.user);
      setCodeModalActive(false);

      if (res.user.needRegularViewInfoForm) {
        router.push("/settings/profile-edit");
      }

      mainSuccess.set("Successfully logged in");
      setCode("");
    } catch (e) {
      setCodeModalError(e.message);
    }
  };

  const handleCloseCodeModal = () => {
    setCodeModalActive(false);
    setLoginPassword("");
    setLoginRememberMe(false);
    setCodeModalError(null);
    setTypeModalError(null);
  };

  const handleCloseTypeModal = () => {
    setTypeModalActive(false);
    setLoginPassword("");
    setLoginRememberMe(false);
    setCodeModalError(null);
    setTypeModalError(null);
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

                  {isAuth && (
                    <li className="nav-item">
                      <Link href="/settings/" className="nav-link">
                        Settings
                      </Link>
                    </li>
                  )}

                  {isSupport && (
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

      {!isAuth && canChangeType && (
        <AuthTypeModal
          typeModalActive={typeModalActive}
          typeModalError={typeModalError}
          handleSelectTypeClick={handleSelectTypeClick}
          handleClose={handleCloseTypeModal}
        />
      )}

      {!isAuth && (
        <AuthCodeModal
          codeModalActive={codeModalActive}
          code={code}
          handleChangeCode={handleChangeCode}
          codeModalError={codeModalError}
          handleCheckCode={handleCheckCode}
          handleClose={handleCloseCodeModal}
        />
      )}

      {!isAuth && (
        <>
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
                        setUser={setUserToAuth}
                        email={loginEmail}
                        setEmail={setLoginEmail}
                        password={loginPassword}
                        setPassword={setLoginPassword}
                        moveToRegister={handleRegisterTabActive}
                        closeModal={closeModals}
                        setCanChangeType={setCanChangeType}
                        setType={setType}
                        setCodeModalActive={setCodeModalActive}
                        setTypeModalActive={setTypeModalActive}
                        rememberMe={loginRememberMe}
                        setRememberMe={setLoginRememberMe}
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
        </>
      )}
    </>
  );
};

export default Navbar;
