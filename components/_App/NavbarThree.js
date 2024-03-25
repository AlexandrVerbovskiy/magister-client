// import { useState, useContext } from "react";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { IndiceContext } from "../../contexts";
import ListingLi from "./Navbar/ListingLi";
import ListingCategorySelect from "./ListingCategorySelect";
import useNavListingCategories from "../../hooks/useNavListingCategories";

const NavbarThree = () => {
  const { isAuth, isSupport, toggleSideMenu } = useContext(IndiceContext);

  const {
    navbarCategories,
    handleChangeCategory: handleChangePopupCategory,
    handleListingClick,
    categoriesLength,
    activePopup,
    setActivePopup,
  } = useNavListingCategories();

  // Add active class
  const [currentPath, setCurrentPath] = useState("");
  const router = useRouter();

  useEffect(() => {
    setCurrentPath(router.asPath);
  }, [router]);

  const [showMenu, setshowMenu] = useState(false);
  const [displayMiniAuth, setDisplayMiniAuth] = useState(false);
  const [displayDropdownProfile, setDisplayDropdownProfile] = useState(false);

  const toggleMiniAuth = () => {
    setDisplayMiniAuth(!displayMiniAuth);
  };

  const toggleMenu = () => {
    setshowMenu(!showMenu);
  };

  const toggleDropdownProfile = () => {
    setDisplayDropdownProfile(!displayDropdownProfile);
  };

  return (
    <>
      <div className="navbar-area">
        <div className="miran-responsive-nav">
          <div className="miran-responsive-menu">
            <div
              onClick={() => toggleMenu()}
              className="hamburger-menu hamburger-two dashboard-hamburger"
            >
              {showMenu ? (
                <i className="bx bx-x"></i>
              ) : (
                <i className="bx bx-menu"></i>
              )}
            </div>
            <div
              className="responsive-burger-menu d-lg-none d-block"
              onClick={toggleSideMenu}
            >
              <span className="top-bar"></span>
              <span className="middle-bar"></span>
              <span className="bottom-bar"></span>
            </div>
          </div>
        </div>

        <div className={showMenu ? "miran-nav show" : "miran-nav"}>
          <nav className="navbar navbar-expand-md navbar-light">
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
            </div>
          </nav>
        </div>
      </div>

      {categoriesLength > 0 && (
        <ListingCategorySelect
          needAll={true}
          active={activePopup}
          setActive={setActivePopup}
          categories={navbarCategories}
          onChange={handleChangePopupCategory}
        />
      )}
    </>
  );
};

export default NavbarThree;
