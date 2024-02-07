// import { useState, useContext } from "react";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { IndiceContext } from "../../contexts";

const NavbarThree = () => {
  const {
    success: mainSuccess,
    isAuth,
    isSupport,
  } = useContext(IndiceContext);

  // Add active class
  const [currentPath, setCurrentPath] = useState("");
  const router = useRouter();

  useEffect(() => {
    setCurrentPath(router.asPath);
  }, [router]);

  const { toggleSideMenu } = useContext(IndiceContext);
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
    </>
  );
};

export default NavbarThree;
