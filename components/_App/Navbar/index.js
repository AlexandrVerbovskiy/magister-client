import React, { useState, useRef, useContext } from "react";
import Link from "next/link";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import RegisterTab from "./RegisterTab";
import LoginTab from "./LoginTab";
import {
  generateTwoFactorCode,
  checkTwoFactorCode,
  verifyEmail,
} from "../../../services";
import { IndiceContext } from "../../../contexts";
import { useRouter } from "next/router";
import AuthCodeModal from "./AuthCodeModal";
import AuthTypeModal from "./AuthTypeModal";
import { signIn } from "next-auth/react";
import ListingLi from "./ListingLi";
import STATIC from "../../../static";
import SignOutModal from "../SignOutModal";
import { useListingListClick } from "../../../hooks";
import VerificationAlert from "../../VerificationAlert";
import BetaAuthAlert from "../../BetaAuthAlert";
import MobileNavbar from "../MobileNavbar";
import EmailVerifiedCodeModal from "./EmailVerifiedCodeModal";

const Navbar = ({
  canShowSearch = true,
  alwaysSticky = false,
  needBetaAlert = true,
}) => {
  const router = useRouter();

  const { isAuth, isSupport, success } = useContext(IndiceContext);
  const [signOutModalActive, setSignOutModalActive] = useState(false);
  const [searchCategory, setSearchCategory] = useState("");

  const [displayAuth, setDisplayAuth] = useState(false);
  const [displayMiniAuth, setDisplayMiniAuth] = useState(false);
  const [sticky, setSticky] = useState(alwaysSticky);

  const showStickyMenu = () => {
    if (!alwaysSticky) {
      if (window.scrollY >= 80) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    } else {
      setSticky(true);
    }
  };

  if (typeof window !== "undefined") {
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

  const handleLoginTabActive = () => {
    loginTabBtnTrigger.current.click();
  };
  const handleRegisterTabActive = () => registerTabBtnTrigger.current.click();

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

  return (
    <>
      {isAuth && <MobileNavbar onLoginClick={toggleAuth} />}

      <div className={displayAuth ? "body_overlay open" : "body_overlay"}></div>
      <div
        className={
          sticky
            ? "is-sticky navbar-area navbar-style-two"
            : "navbar-area navbar-style-two"
        }
      >
        {needBetaAlert && <BetaAuthAlert />}
        <div className="miran-responsive-nav">
          <div className="container">
            <div className="miran-responsive-menu">
              <div onClick={toggleMenu} className="hamburger-menu">
                {showMenu ? (
                  <i className="bx bx-x"></i>
                ) : (
                  <i className="bx bx-menu"></i>
                )}
              </div>

              <div className="logo">
                <Link href="/">
                  <img
                    src="/images/rent-about-logo.png"
                    className="logo-image"
                    alt="logo"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className={showMenu ? "miran-nav show" : "miran-nav"}>
          <div className="container-fluid">
            <nav className="navbar navbar-expand-md navbar-light">
              <Link href="/" className="navbar-brand">
                <img
                  src="/images/rent-about-logo.png"
                  className="logo-image"
                  alt="logo"
                />
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
        <VerificationAlert className="verification-alert-main" />
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
        <EmailVerifiedCodeModal
          code={emailVerifiedCode}
          activeModal={emailVerifiedCodeModalActive}
          closeModal={() => setEmailVerifiedCodeModalActive(false)}
          handleInputCode={handleChangeEmailVerifiedCode}
          verifyFormError={emailVerifiedCodeModalError}
          handleVerifyCode={handleEmailVerifyCode}
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

      {isAuth && (
        <SignOutModal
          active={signOutModalActive}
          closeModal={() => setSignOutModalActive(false)}
        />
      )}
    </>
  );
};

export default Navbar;
