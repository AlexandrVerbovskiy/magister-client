// import { useState, useContext } from "react";
import React, { useState, useContext } from "react";
import Link from "next/link";
import { IndiceContext } from "../../contexts";
import ListingLi from "./Navbar/ListingLi";
import VerificationAlert from "../VerificationAlert";
import { useIsMobile, useListingListClick } from "../../hooks";

const NavbarThree = ({ children = null }) => {
  const { isAuth, isSupport } = useContext(IndiceContext);
  const [showMenu, setshowMenu] = useState(false);

  const toggleMenu = () => {
    setshowMenu(!showMenu);
  };

  const isMobile = useIsMobile();

  const { handleClick: handleListingClick } = useListingListClick({
    link: "/dashboard/listings/add/",
  });
  return (
    <>
      <div className="navbar-area">
        <div className="miran-responsive-nav">
          <div className="miran-responsive-menu d-flex align-items-center">
            {children && (
              <div
                onClick={() => toggleMenu()}
                className="hamburger-menu dashboard-hamburger"
              >
                {showMenu ? (
                  <i className="bx bx-x"></i>
                ) : (
                  <i className="bx bx-menu"></i>
                )}
              </div>
            )}
            <div className="responsive-burger-menu d-lg-none d-block">
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

      <VerificationAlert />
    </>
  );
};

export default NavbarThree;
