import React, { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import RegisterTab from "./Navbar/RegisterTab";
import LoginTab from "./Navbar/LoginTab";
import { generateTwoFactorCode, checkTwoFactorCode } from "../../services";
import { IndiceContext } from "../../contexts";
import AuthCodeModal from "./Navbar/AuthCodeModal";
import AuthTypeModal from "./Navbar/AuthTypeModal";
import { signIn } from "next-auth/react";
import useSearchCategory from "../../hooks/useSearchCategory";
import SearchTipsPopup from "../SearchTipsPopup";
import { getListingSearchLink } from "../../utils";
import ListingLi from "./Navbar/ListingLi";
import ListingPopup from "./Navbar/ListingPopup";
import useNavListingCategories from "../../hooks/useNavListingCategories";
import STATIC from "../../static";
import SignOutModal from "./SignOutModal";

const NavbarTwo = ({ canShowSearch = false }) => {
  const {
    isAuth,
    success: mainSuccess,
    isSupport,
    onLogin,
  } = useContext(IndiceContext);

  const {
    navbarCategories,
    handleListingClick,
    categoriesLength,
    activePopup,
    setActivePopup,
  } = useNavListingCategories();

  const categoryFilterRef = useRef(null);
  const smallCategoryFilterRef = useRef(null);
  const [signOutModalActive, setSignOutModalActive] = useState(false);

  const {
    categoryTipsPopupActive,
    categoryTips,
    openCategoryTipsPopup,
    closeCategoryTipsPopup,
    updateCategoryTips,
  } = useSearchCategory();

  const [searchCategory, setSearchCategory] = useState("");

  const router = useRouter();

  const [displayAuth, setDisplayAuth] = useState(false);
  const [displayMiniAuth, setDisplayMiniAuth] = useState(false);
  const [sticky, setSticky] = useState(true);

  const handleChangeCategory = (e) => {
    const newValue = e.target.value;
    updateCategoryTips(newValue);
    setSearchCategory(newValue);
  };

  const handleCategoryTipClick = (value) => {
    categoryFilterRef.current.blur();
    smallCategoryFilterRef.current.blur();
    setSearchCategory(value);
    updateCategoryTips(value);
    const link = getListingSearchLink(value);
    router.push(link, undefined, { unstable_skipClientCache: true });
  };

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchCategory) return;

    handleSearchClick();
  };

  const handleSearchClick = () => {
    const link = getListingSearchLink(searchCategory);
    router.push(link);
    setSearchCategory("");
    document.querySelector(".navbar-search-box input").blur();
  };

  return (
    <>
      <div className={displayAuth ? "body_overlay open" : "body_overlay"}></div>
      <div className={sticky ? "is-sticky navbar-area" : "navbar-area"}>
        <div className="miran-responsive-nav">
          <div className="container">
            <div className="miran-responsive-menu">
              <div
                onClick={() => toggleMenu()}
                className="hamburger-menu hamburger-two"
              >
                {showMenu ? (
                  <i className="bx bx-x"></i>
                ) : (
                  <i className="bx bx-menu"></i>
                )}
              </div>
              <div className="logo">
                <Link href="/">
                  <img
                    src="/images/rent-about-logo-black.png"
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

                  <ListingLi
                    categoriesLength={categoriesLength}
                    handleListingClick={handleListingClick}
                  />

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
                      <Link
                        href="#"
                        className="nav-link"
                        onClick={(e) => {
                          e.preventDefault();
                          setSignOutModalActive(true);
                        }}
                      >
                        Sign out
                      </Link>
                    </li>
                  ) : (
                    <li className="nav-item d-block d-xl-none">
                      <Link href="#" className="nav-link" onClick={toggleAuth}>
                        Login / Register
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
                        activePopup={displayAuth}
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

      {categoriesLength > 0 && (
        <ListingPopup
          active={activePopup}
          setActive={setActivePopup}
          categories={navbarCategories}
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
