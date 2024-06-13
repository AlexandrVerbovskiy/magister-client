import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { IndiceContext } from "../../contexts";
import { signOut } from "next-auth/react";

const DashboardNavbar = () => {
  // Add active class
  const [currentPath, setCurrentPath] = useState("");
  const router = useRouter();

  useEffect(() => {
    setCurrentPath(router.asPath);
  }, [router]);

  const { displaySideMenu, toggleSideMenu, sessionUser, error, isAuth } =
    useContext(IndiceContext);

  const needVerifyAccount = (e) => {
    if (!sessionUser?.verified || !sessionUser?.paypalId) {
      e.preventDefault();
      error.set(`You need to be verified and have a PayPal ID linked to your profile to rent and rent out tools. To verify, send the
      necessary data via the "Documents Verification" page`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
    } catch (e) {
      error.set(e.message);
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
                }  ${
                  !sessionUser?.verified
                    ? "disabled"
                    : ""
                }`}
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
                href="/dashboard/bookings/"
                className={`nav-link ${
                  currentPath.includes("/dashboard/bookings/") && "active"
                }  ${
                  !sessionUser?.verified
                    ? "disabled"
                    : ""
                }`}
                onClick={needVerifyAccount}
              >
                <span className="icon">
                  <i className="bx bx-timer"></i>
                </span>
                <span className="menu-title">Bookings</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link
                href="/dashboard/orders/"
                className={`nav-link ${
                  currentPath.includes("/dashboard/orders/") && "active"
                }  ${
                  !sessionUser?.verified
                    ? "disabled"
                    : ""
                }`}
                onClick={needVerifyAccount}
              >
                <span className="icon">
                  <i className="bx bx-purchase-tag"></i>
                </span>
                <span className="menu-title">Orders</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link
                href="/dashboard/wallet/"
                className={`nav-link ${
                  currentPath.includes("/dashboard/wallet/") && "active"
                }  ${
                  !sessionUser?.verified
                    ? "disabled"
                    : ""
                }`}
                onClick={needVerifyAccount}
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
                  <i className="bx bxs-user-circle"></i>
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
                  handleSignOut();
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
    </>
  );
};

export default DashboardNavbar;
