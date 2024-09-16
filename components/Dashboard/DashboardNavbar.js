import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { IndiceContext } from "../../contexts";
import SignOutModal from "../_App/SignOutModal";
import MobileNavbar from "../_App/MobileNavbar";

const DashboardNavbar = () => {
  // Add active class
  const [currentPath, setCurrentPath] = useState("");
  const [signOutModalActive, setSignOutModalActive] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setCurrentPath(router.asPath);
  }, [router]);

  const { displaySideMenu, toggleSideMenu, sessionUser, error, isAuth } =
    useContext(IndiceContext);

  return (
    <>
      {isAuth && <MobileNavbar />}

      <div
        className={
          "sidemenu-area d-xl-block" +
          (displaySideMenu ? "active-sidemenu-area" : "")
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
                href="/dashboard/"
                className={`nav-link ${
                  currentPath == "/dashboard/" && "active"
                }`}
              >
                <span className="icon">
                  <i className="bx bx-home-circle"></i>
                </span>
                <span className="menu-title">Main</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link
                href="/dashboard/listings/"
                className={`nav-link ${
                  currentPath.includes("/dashboard/listings/") && "active"
                }`}
              >
                <span className="icon">
                  <i className="bx bx-layer"></i>
                </span>
                <span className="menu-title">My Items</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link href="/listings/" className={`nav-link`}>
                <span className="icon">
                  <i className="bx bx-wrench"></i>
                </span>
                <span className="menu-title">Search Items</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link
                href="/dashboard/orders/"
                className={`nav-link ${
                  currentPath.includes("/dashboard/orders/") && "active"
                }`}
              >
                <span className="icon">
                  <i className="bx bx-purchase-tag"></i>
                </span>
                <span className="menu-title">Orders</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link
                href="/dashboard/chats/"
                className={`nav-link ${
                  currentPath.includes("/dashboard/chats/") && "active"
                }`}
              >
                <span className="icon">
                  <i className="bx bx-message-detail"></i>
                </span>
                <span className="menu-title">Chat</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link
                href="/dashboard/wallet/"
                className={`nav-link ${
                  currentPath.includes("/dashboard/wallet/") && "active"
                }`}
              >
                <span className="icon">
                  <i className="bx bx-wallet"></i>
                </span>
                <span className="menu-title">Wallet</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link
                href="/dashboard/profile-edit/"
                className={`nav-link ${
                  [
                    "/dashboard/profile-edit/",
                    "/dashboard/documents-verification/",
                  ].includes(currentPath) && "active"
                }`}
              >
                <span className="icon">
                  <i className="bx bx-user-circle"></i>
                </span>
                <span className="menu-title">Profile</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link
                href="#"
                className={`nav-link`}
                onClick={(e) => {
                  e.preventDefault();
                  setSignOutModalActive(true);
                }}
              >
                <span className="icon">
                  <i className="bx bx-log-out"></i>{" "}
                </span>
                <span className="menu-title">Sign Out</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {isAuth && (
        <SignOutModal
          active={signOutModalActive}
          closeModal={() => setSignOutModalActive(false)}
        />
      )}
    </>
  );
};

export default DashboardNavbar;
