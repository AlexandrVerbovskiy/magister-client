import React, { useState, useContext, useEffect } from "react";  
import { useRouter } from "next/router";
import Link from 'next/link';
import { IndiceContext } from "../../contexts";

const DashboardNavbar = () => {

  // Add active class
  const [currentPath, setCurrentPath] = useState("");
  const router = useRouter();

  useEffect(() => {
    setCurrentPath(router.asPath);
  }, [router]);

  const { displaySideMenu, toggleSideMenu } = useContext(IndiceContext);
  const [display, setDisplay] = useState(false);

  const listingToggle = () => {
    setDisplay(!display);
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
            <img src="/images/black-logo.png" alt="image" />
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
                <span className="menu-title">Dashboard</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link 
                href="/dashboard/messages/"
                className={`nav-link ${
                  currentPath == "/dashboard/messages/" && "active"
                }`}
              >
                <span className="icon">
                  <i className="bx bx-envelope-open"></i>
                </span>
                <span className="menu-title">Messages</span>
                <span className="badge">3</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link 
                href="/dashboard/bookings/" 
                className={`nav-link ${
                  currentPath == "/dashboard/bookings" && "active"
                }`}
              >
                <span className="icon">
                  <i className="bx bx-copy"></i>
                </span>
                <span className="menu-title">Bookings</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link 
                href="/dashboard/wallet/" 
                className={`nav-link ${
                  currentPath == "/dashboard/wallet/" && "active"
                }`}
              >
                <span className="icon">
                  <i className="bx bx-wallet"></i>
                </span>
                <span className="menu-title">Wallet</span>
              </Link>
            </li>

            <li className="nav-item-title">Listings</li>

            <li className="nav-item">
              <a
                href="#"
                className="collapsed-nav-link nav-link"
                onClick={listingToggle}
              >
                <span className="icon">
                  <i className="bx bx-layer"></i>
                </span>
                <span className="menu-title">My Listings</span>
              </a>

              <ul
                className={
                  display
                    ? "sidemenu-nav-second-level show"
                    : "sidemenu-nav-second-level sidemenu-nav-display"
                }
              >
                <li className="nav-item active-section">
                  <Link
                    href="/dashboard/my-listing/active/"
                    className={`nav-link ${
                      currentPath == "/dashboard/my-listing/active/" && "active"
                    }`}
                  >
                    <span className="menu-title">Active</span>
                    <span className="badge">5</span>
                  </Link>
                </li>

                <li className="nav-item active-section">
                  <Link
                    href="/dashboard/my-listing/pending/"
                    className={`nav-link ${
                      currentPath == "/dashboard/my-listing/pending/" && "active"
                    }`}
                  >
                    <span className="menu-title">Pending</span>
                    <span className="badge yellow">1</span>
                  </Link>
                </li>

                <li className="nav-item active-section">
                  <Link
                    href="/dashboard/my-listing/expired/"
                    className={`nav-link ${
                      currentPath == "/dashboard/my-listing/expired" && "active"
                    }`}
                  >
                 
                      <span className="menu-title">Expired</span>
                      <span className="badge red">2</span>
                
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <Link 
                href="/dashboard/reviews/" 
                className={`nav-link ${
                  currentPath == "/dashboard/reviews/" && "active"
                }`}
              >
                <span className="icon">
                  <i className="bx bx-star"></i>
                </span>
                <span className="menu-title">Reviews</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link 
                href="/dashboard/bookmarks/" 
                className={`nav-link ${
                  currentPath == "/dashboard/bookmarks" && "active"
                }`}
              >
              
                  <span className="icon">
                    <i className="bx bx-heart"></i>
                  </span>
                  <span className="menu-title">Bookmarks</span>
             
              </Link>
            </li>

            <li className="nav-item">
              <Link 
                href="/dashboard/add-listing/" 
                className={`nav-link ${
                  currentPath == "/dashboard/add-listing/" && "active"
                }`}
              >
                <span className="icon">
                  <i className="bx bx-plus-circle"></i>
                </span>
                <span className="menu-title">Add Listings</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link 
                href="/dashboard/invoice/" 
                className={`nav-link ${
                  currentPath == "/dashboard/invoice/" && "active"
                }`}
              >
                <span className="icon">
                  <i className="bx bx-certification"></i>
                </span>
                <span className="menu-title">Invoice</span>
              </Link>
            </li>

            <li className="nav-item-title">Account</li>

            <li className="nav-item">
              <Link 
                href="/dashboard/profile/" 
                className={`nav-link ${
                  currentPath == "/dashboard/profile" && "active"
                }`}
              >
                <span className="icon">
                  <i className="bx bxs-user-circle"></i>
                </span>
                <span className="menu-title">Profile</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link href="#">
                <span className="icon">
                  <i className="bx bx-log-out"></i>
                </span>
                <span className="menu-title">Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default DashboardNavbar;
