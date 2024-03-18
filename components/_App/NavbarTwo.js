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
import { signIn, signOut } from "next-auth/react";
import useSearchCategory from "../../hooks/useSearchCategory";
import SearchTipsPopup from "../SearchTipsPopup";
import { getListingSearchLink } from "../../utils";
import CategoriesNavbar from "../CategoriesNavbar";

const NavbarTwo = ({ canShowSearch = true }) => {
  const {
    isAuth,
    success: mainSuccess,
    isSupport,
    onLogin,
    error: mainError,
    categories = {},
  } = useContext(IndiceContext);

  const categoryFilterRef = useRef(null);
  const smallCategoryFilterRef = useRef(null);

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
  const [sticky, setSticky] = useState(false);

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

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
    } catch (e) {
      mainError.set(e.message);
    }
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

      await signIn("credentials", {
        authToken: res.authToken,
        redirect: false,
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
                {canShowSearch && (
                  <form
                    onSubmit={handleSearchSubmit}
                    className="navbar-search-box search-box-one"
                  >
                    <label onClick={handleSearchClick}>
                      <i className="flaticon-search"></i>
                    </label>

                    <input
                      type="text"
                      className="input-search"
                      placeholder="What are you looking for?"
                      ref={categoryFilterRef}
                      value={searchCategory}
                      name="listingCategorySearch"
                      onFocus={() => openCategoryTipsPopup(searchCategory)}
                      onBlur={closeCategoryTipsPopup}
                      onInput={handleChangeCategory}
                    />

                    <SearchTipsPopup
                      active={categoryTipsPopupActive}
                      tips={categoryTips}
                      handleTipClick={handleCategoryTipClick}
                    />
                  </form>
                )}

                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link href="/" className="nav-link">
                      Home
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      href="/listing-list"
                      className={`${
                        categories.length > 0 ? "dropdown-toggle " : ""
                      }nav-link`}
                    >
                      Listings
                    </Link>

                    {categories.length > 0 && (
                      <CategoriesNavbar categories={categories} />
                    )}
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
                  {canShowSearch && (
                    <div className="option-item">
                      <form
                        onSubmit={handleSearchSubmit}
                        className="navbar-search-box"
                      >
                        <label onClick={handleSearchClick}>
                          <i className="flaticon-search"></i>
                        </label>
                        <input
                          type="text"
                          className="input-search"
                          placeholder="What are you looking for?"
                          name="listingCategorySearch"
                          ref={smallCategoryFilterRef}
                          value={searchCategory}
                          onFocus={() => openCategoryTipsPopup(searchCategory)}
                          onBlur={closeCategoryTipsPopup}
                          onInput={handleChangeCategory}
                        />

                        <SearchTipsPopup
                          active={categoryTipsPopupActive}
                          tips={categoryTips}
                          handleTipClick={handleCategoryTipClick}
                        />
                      </form>
                    </div>
                  )}

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
                </div>
              </div>
            </div>
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
    </>
  );
};

export default NavbarTwo;
