// import { useState, useContext } from "react";
import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { IndiceContext } from "../../contexts";
import ListingLi from "./Navbar/ListingLi";
import ListingPopup from "./Navbar/ListingPopup";
import useNavListingCategories from "../../hooks/useNavListingCategories";
import VerificateAlert from "../VerificateAlert";
import { useIsMobile } from "../../hooks";

const NavbarThree = ({ children = null }) => {
  const { isAuth, isSupport } = useContext(IndiceContext);

  const {
    navbarCategories,
    handleListingClick,
    categoriesLength,
    activePopup,
    setActivePopup,
  } = useNavListingCategories();

  const [showMenu, setshowMenu] = useState(false);

  const toggleMenu = () => {
    setshowMenu(!showMenu);
  };

  const isMobile = useIsMobile();

  return (
    <>
      <div className="navbar-area">
        <div className="miran-responsive-nav">
          <div className="miran-responsive-menu d-flex align-items-center">
            {children && (
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
            )}
            <div className="responsive-burger-menu d-lg-none d-block">
              <img
                src="/images/rent-about-logo-black.png"
                className="logo-image"
                alt="logo"
              />
            </div>
          </div>
        </div>

        <div className={"miran-nav d-none d-xl-block"}>
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
              </ul>
            </div>
          </nav>
        </div>

        {children && isMobile && (
          <div className={"miran-nav" + (showMenu ? "show" : "")}>
            <nav className="navbar navbar-expand-md navbar-light pb-0">
              <div className="collapse navbar-collapse mean-menu">
                {children}
              </div>
            </nav>
          </div>
        )}
      </div>

      <VerificateAlert />

      {categoriesLength > 0 && (
        <ListingPopup
          active={activePopup}
          setActive={setActivePopup}
          categories={navbarCategories}
        />
      )}
    </>
  );
};

export default NavbarThree;
