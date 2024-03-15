import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { IndiceContext } from "../../contexts";

const DashboardNavbar = () => {
  // Add active class
  const [currentPath, setCurrentPath] = useState("");
  const router = useRouter();

  useEffect(() => {
    setCurrentPath(router.asPath);
  }, [router]);

  const { displaySideMenu, toggleSideMenu, user, error } =
    useContext(IndiceContext);

  const needVerifyAccount = (e) => {
    if (!user.verified) {
      e.preventDefault();
      error.set(`You need to be verified to rent and rent tools. To verify, send the
      necessary data via the "Documents Verification" page`);
    }
  };

  return (
    <>
      <div
        className={
          displaySideMenu
            ? "sidemenu-area active-sidemenu-area"
            : "sidemenu-area"
        }
      >
        <div className="sidemenu-header">
          <Link href="/" className="navbar-brand d-flex align-items-center">
            <img
              src="/images/rent-about-logo-black.png"
              className="logo-image"
              alt="logo"
            />
          </Link>

          <div
            className="responsive-burger-menu d-block d-lg-none"
            onClick={toggleSideMenu}
          >
            <i className="bx bx-x"></i>
          </div>
        </div>

        <div className="sidemenu-body">
          <ul
            className="sidemenu-nav metisMenu h-100"
            id="sidemenu-nav"
            data-simplebar
          >
            <li className="nav-item-title">Main</li>

            <li className="nav-item">
              <Link
                href="/settings/"
                className={`nav-link ${
                  currentPath == "/settings/" && "active"
                }`}
              >
                <span className="icon">
                  <i className="bx bx-home-circle"></i>
                </span>
                <span className="menu-title">Main Settings</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link
                href="/settings/listings/"
                className={`nav-link ${
                  currentPath.includes("/settings/listings/") && "active"
                }  ${!user.verified ? "disabled" : ""}`}
                onClick={needVerifyAccount}
              >
                <span className="icon">
                  <i className="bx bx-layer"></i>
                </span>
                <span className="menu-title">Listings</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link
                href="/settings/profile-edit/"
                className={`nav-link ${
                  currentPath == "/settings/profile-edit/" && "active"
                }`}
              >
                <span className="icon">
                  <i className="bx bxs-user-circle"></i>
                </span>
                <span className="menu-title">Profile Edit</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link
                href="/settings/documents-verification/"
                className={`nav-link ${
                  currentPath == "/settings/documents-verification/" && "active"
                }`}
              >
                <span className="icon">
                  <i className="bx bx-file"></i>
                </span>
                <span className="menu-title">Documents Verification</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default DashboardNavbar;
