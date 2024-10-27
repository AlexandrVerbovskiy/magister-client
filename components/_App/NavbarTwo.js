import React, { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import RegisterTab from "./Navbar/RegisterTab";
import LoginTab from "./Navbar/LoginTab";
import {
  generateTwoFactorCode,
  checkTwoFactorCode,
  verifyEmail,
} from "../../services";
import { IndiceContext } from "../../contexts";
import AuthCodeModal from "./Navbar/AuthCodeModal";
import AuthTypeModal from "./Navbar/AuthTypeModal";
import { signIn } from "next-auth/react";
import ListingLi from "./Navbar/ListingLi";
import STATIC from "../../static";
import SignOutModal from "./SignOutModal";
import VerificationAlert from "../VerificationAlert";
import MobileNavbar from "./MobileNavbar";
import { useIsMobile, useListingListClick } from "../../hooks";
import EmailVerifiedCodeModal from "./Navbar/EmailVerifiedCodeModal";

const NavbarTwo = ({
  children = null,
  needMobile = true,
  needMobileSticky = true,
  MobileLogoComponent = null,
}) => {
  const { isAuth, isSupport, success } = useContext(IndiceContext);

  const [signOutModalActive, setSignOutModalActive] = useState(false);

  const [displayAuth, setDisplayAuth] = useState(false);
  const [displayMiniAuth, setDisplayMiniAuth] = useState(false);
  const [sticky, setSticky] = useState(true);

  //sticky menu

  const showStickyMenu = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };

  useEffect(() => {
    showStickyMenu();
  }, []);

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

  const [userToAuth, setUserToAuth] = useState(null);

  const [canChangeType, setCanChangeType] = useState(false);
  const [type, setType] = useState("email");
  const [typeModalActive, setTypeModalActive] = useState(false);
  const [typeModalError, setTypeModalError] = useState(null);

  const [code, setCode] = useState("");
  const [codeModalActive, setCodeModalActive] = useState(false);
  const [codeModalError, setCodeModalError] = useState(null);

  const handleChangeCode = (e) => {
    setCode(e.target.value);
    setCodeModalError(null);
  };

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRememberMe, setLoginRememberMe] = useState(false);

  const [emailVerifiedTab, setEmailVerifiedTab] = useState("login");
  const [emailVerifiedEmail, setEmailVerifiedEmail] = useState("");
  const [emailVerifiedCode, setEmailVerifiedCode] = useState("");
  const [emailVerifiedCodeModalActive, setEmailVerifiedCodeModalActive] =
    useState(false);
  const [emailVerifiedCodeModalError, setEmailVerifiedCodeModalError] =
    useState(null);

  const handleChangeEmailVerifiedCode = (e) => {
    setEmailVerifiedCode(e.target.value);
    setEmailVerifiedCodeModalError(null);
  };

  const handleEmailVerifyCode = async () => {
    try {
      const rememberMe = emailVerifiedTab === "login" ? loginRememberMe : false;
      const res = await verifyEmail(
        emailVerifiedEmail,
        emailVerifiedCode,
        rememberMe
      );
      await onLoginPartSuccess(res, "Email verified successfully");
    } catch (e) {
      setEmailVerifiedCodeModalError(e.message);
    }
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

      await signIn("credentials", {
        authToken: res.authToken,
        callbackUrl: STATIC.REDIRECTS.SUCCESS_LOGIN,
      });
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

  const onLoginPartSuccess = async (
    res,
    successMessage = "Successfully logged in",
    tab = "login"
  ) => {
    closeModals();

    if (res.emailVerifiedCodeSent) {
      setCanChangeType(false);
      setEmailVerifiedCodeModalActive(true);
      setEmailVerifiedEmail(res.email);
      setEmailVerifiedTab(tab);
      success.set(successMessage);
      return;
    }

    if (res.needCode) {
      if (res.codeSent) {
        setCanChangeType(false);
        setType("email");
        setCodeModalActive(true);
      } else {
        setCanChangeType(true);
        setTypeModalActive(true);
      }

      return;
    }

    await signIn("credentials", {
      userId: res.userId,
      authToken: res.authToken,
      callbackUrl:
        STATIC.REDIRECTS.EDIT_PROFILE_LINK + "?success=" + successMessage,
      needRegularViewInfoForm: res.needRegularViewInfoForm,
    });
  };

  const { handleClick: handleListingClick } = useListingListClick({
    link: "/listings",
  });

  const isMobile = useIsMobile();

  let LogoComponent = () => (
    <div className="logo">
      <Link href="/">
        <img
          src="/images/rent-about-logo-black.png"
          className="logo-image"
          alt="logo"
        />
      </Link>
    </div>
  );

  if (isMobile && MobileLogoComponent) {
    LogoComponent = MobileLogoComponent;
  }

  return (
    <>
      {needMobile && isAuth && <MobileNavbar onLoginClick={toggleAuth} />}

      <div className={displayAuth ? "body_overlay open" : "body_overlay"}></div>
      <div
        className={`navbar-area ${
          showMenu && !needMobile ? "" : "navbar-area-two"
        } ${(needMobileSticky || !isMobile) && sticky ? "is-sticky" : ""}`}
        style={
          !needMobileSticky ? { overflowY: "auto", maxHeight: "100vh" } : {}
        }
      >
        <div className="miran-responsive-nav">
          <div className="container">
            <div className="miran-responsive-menu overflow-hidden">
              {(children || !needMobile) && (
                <div
                  onClick={() => toggleMenu()}
                  className="hamburger-menu hamburger-two"
                >
                  {showMenu ? (
                    <i
                      className="bx bx-x ms-1"
                      style={{ marginRight: "-5px" }}
                    ></i>
                  ) : (
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_1669_3247)">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M30 6.66667C30 6.22464 29.8244 5.80072 29.5118 5.48816C29.1993 5.17559 28.7754 5 28.3333 5C27.8913 5 27.4674 5.17559 27.1548 5.48816C26.8423 5.80072 26.6667 6.22464 26.6667 6.66667V8.33333H6.66667C6.22464 8.33333 5.80072 8.50893 5.48816 8.82149C5.17559 9.13405 5 9.55797 5 10C5 10.442 5.17559 10.866 5.48816 11.1785C5.80072 11.4911 6.22464 11.6667 6.66667 11.6667H26.6667V13.3333C26.6667 13.7754 26.8423 14.1993 27.1548 14.5118C27.4674 14.8244 27.8913 15 28.3333 15C28.7754 15 29.1993 14.8244 29.5118 14.5118C29.8244 14.1993 30 13.7754 30 13.3333V11.6667H33.3333C33.7754 11.6667 34.1993 11.4911 34.5118 11.1785C34.8244 10.866 35 10.442 35 10C35 9.55797 34.8244 9.13405 34.5118 8.82149C34.1993 8.50893 33.7754 8.33333 33.3333 8.33333H30V6.66667ZM6.66667 18.3333C6.22464 18.3333 5.80072 18.5089 5.48816 18.8215C5.17559 19.134 5 19.558 5 20C5 20.442 5.17559 20.8659 5.48816 21.1785C5.80072 21.4911 6.22464 21.6667 6.66667 21.6667H10V23.3333C10 23.7754 10.1756 24.1993 10.4882 24.5118C10.8007 24.8244 11.2246 25 11.6667 25C12.1087 25 12.5326 24.8244 12.8452 24.5118C13.1577 24.1993 13.3333 23.7754 13.3333 23.3333V21.6667H33.3333C33.7754 21.6667 34.1993 21.4911 34.5118 21.1785C34.8244 20.8659 35 20.442 35 20C35 19.558 34.8244 19.134 34.5118 18.8215C34.1993 18.5089 33.7754 18.3333 33.3333 18.3333H13.3333V16.6667C13.3333 16.2246 13.1577 15.8007 12.8452 15.4882C12.5326 15.1756 12.1087 15 11.6667 15C11.2246 15 10.8007 15.1756 10.4882 15.4882C10.1756 15.8007 10 16.2246 10 16.6667V18.3333H6.66667ZM5 30C5 29.558 5.17559 29.134 5.48816 28.8215C5.80072 28.5089 6.22464 28.3333 6.66667 28.3333H26.6667V26.6667C26.6667 26.2246 26.8423 25.8007 27.1548 25.4882C27.4674 25.1756 27.8913 25 28.3333 25C28.7754 25 29.1993 25.1756 29.5118 25.4882C29.8244 25.8007 30 26.2246 30 26.6667V28.3333H33.3333C33.7754 28.3333 34.1993 28.5089 34.5118 28.8215C34.8244 29.134 35 29.558 35 30C35 30.442 34.8244 30.866 34.5118 31.1785C34.1993 31.4911 33.7754 31.6667 33.3333 31.6667H30V33.3333C30 33.7754 29.8244 34.1993 29.5118 34.5118C29.1993 34.8244 28.7754 35 28.3333 35C27.8913 35 27.4674 34.8244 27.1548 34.5118C26.8423 34.1993 26.6667 33.7754 26.6667 33.3333V31.6667H6.66667C6.22464 31.6667 5.80072 31.4911 5.48816 31.1785C5.17559 30.866 5 30.442 5 30Z"
                          fill="#221638"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1669_3247">
                          <rect width="40" height="40" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  )}
                </div>
              )}
              <LogoComponent />
            </div>
          </div>
        </div>

        <div
          className={
            showMenu && !needMobile
              ? "miran-nav show"
              : "miran-nav d-none d-xl-block"
          }
        >
          <div className="container-fluid">
            <nav className="navbar navbar-expand-md navbar-light">
              <Link href="/" className="navbar-brand">
                <img
                  src="/images/rent-about-logo-black.png"
                  className="logo-image"
                  alt="logo"
                />{" "}
              </Link>
              <div className="collapse navbar-collapse mean-menu">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link href="/" className="nav-link">
                      Home
                    </Link>
                  </li>

                  <ListingLi handleListingClick={handleListingClick} />

                  {isAuth && (
                    <li className="nav-item">
                      <Link href="/dashboard/" className="nav-link">
                        Dashboard
                      </Link>
                    </li>
                  )}

                  {isSupport ? (
                    <li className="nav-item">
                      <Link href="/admin/" className="nav-link">
                        Admin Section
                      </Link>
                    </li>
                  ) : (
                    <li className="nav-item">
                      <Link href="/how-it-works/" className="nav-link">
                        How it works
                      </Link>
                    </li>
                  )}

                  {isAuth ? (
                    <li className="nav-item d-block d-xl-none">
                      <a
                        href="#"
                        className="nav-link"
                        onClick={(e) => {
                          e.preventDefault();
                          setSignOutModalActive(true);
                        }}
                      >
                        Sign out
                      </a>
                    </li>
                  ) : (
                    <li className="nav-item d-block d-xl-none">
                      <a
                        href="#"
                        className="nav-link"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleAuth();
                        }}
                      >
                        Login / Register
                      </a>
                    </li>
                  )}
                </ul>

                <div className="others-option d-flex align-items-center">
                  {!isAuth && (
                    <div className="option-item">
                      <span
                        data-toggle="modal"
                        onClick={toggleAuth}
                        className="auth-one sign-form-trigger"
                      >
                        <i className="flaticon-user"></i> Login / Register
                      </span>
                    </div>
                  )}

                  {isAuth && (
                    <div className="option-item">
                      <span
                        data-toggle="modal"
                        onClick={(e) => {
                          e.preventDefault();
                          setSignOutModalActive(true);
                        }}
                        className="auth-one sign-out-trigger"
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

        {isMobile && children && needMobile && (
          <div className={"miran-nav " + (showMenu ? "show" : "")}>
            <div className="container-fluid">
              <nav className="navbar navbar-expand-md navbar-light">
                <Link href="/" className="navbar-brand">
                  <img
                    src="/images/rent-about-logo-black.png"
                    className="logo-image"
                    alt="logo"
                  />{" "}
                </Link>
                <div
                  className="collapse navbar-collapse mean-menu"
                  style={{ width: "100%" }}
                >
                  {children}
                </div>
              </nav>
            </div>
          </div>
        )}

        {!showMenu && (
          <VerificationAlert className="verification-alert-listings" />
        )}
      </div>

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
          type={type}
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

                  <div className="tab-content">
                    <TabPanel>
                      <LoginTab
                        activePopup={displayAuth}
                        setUser={setUserToAuth}
                        email={loginEmail}
                        setEmail={setLoginEmail}
                        password={loginPassword}
                        setPassword={setLoginPassword}
                        moveToRegister={handleRegisterTabActive}
                        rememberMe={loginRememberMe}
                        setRememberMe={setLoginRememberMe}
                        onLoginPartSuccess={onLoginPartSuccess}
                      />
                    </TabPanel>

                    <TabPanel>
                      <RegisterTab
                        activePopup={displayAuth}
                        moveToLogin={handleLoginTabActive}
                        onRegisterPartSuccess={(res) =>
                          onLoginPartSuccess(
                            res,
                            "Successfully registration",
                            "register"
                          )
                        }
                      />
                    </TabPanel>
                  </div>
                </Tabs>
              </div>
            </div>
          </div>
        </>
      )}

      {!isAuth && (
        <EmailVerifiedCodeModal
          code={emailVerifiedCode}
          activeModal={emailVerifiedCodeModalActive}
          closeModal={() => setEmailVerifiedCodeModalActive(false)}
          handleInputCode={handleChangeEmailVerifiedCode}
          verifyFormError={emailVerifiedCodeModalError}
          handleVerifyCode={handleEmailVerifyCode}
        />
      )}

      {isAuth && (
        <SignOutModal
          active={signOutModalActive}
          closeModal={() => setSignOutModalActive(false)}
        />
      )}
    </>
  );
};

export default NavbarTwo;
