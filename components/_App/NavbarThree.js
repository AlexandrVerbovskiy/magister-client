// import { useState, useContext } from "react";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { IndiceContext } from "../../contexts";

const NavbarThree = () => {
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
                  <Link href="#" className="dropdown-toggle nav-link">
                    Home
                  </Link>

                  <ul className="dropdown-menu">
                    <li className="nav-item">
                      <Link
                        href="/"
                        className={`nav-link ${currentPath == "/" && "active"}`}
                      >
                        Home Demo - 1
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/index-2/"
                        className={`nav-link ${
                          currentPath == "/index-2/" && "active"
                        }`}
                      >
                        Home Demo - 2
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/index-3/"
                        className={`nav-link ${
                          currentPath == "/index-3/" && "active"
                        }`}
                      >
                        Home Demo - 3
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/index-4/"
                        className={`nav-link ${
                          currentPath == "/index-4/" && "active"
                        }`}
                      >
                        Home Demo - 4
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="nav-item">
                  <Link href="#" className="dropdown-toggle nav-link">
                    Listings
                  </Link>

                  <ul className="dropdown-menu">
                    <li className="nav-item">
                      <Link href="#" className="nav-link">
                        List Layout <i className="bx bx-chevron-right"></i>
                      </Link>

                      <ul className="dropdown-menu">
                        <li className="nav-item">
                          <Link
                            href="/vertical-listings-left-sidebar/"
                            className={`nav-link ${
                              currentPath ==
                                "/vertical-listings-left-sidebar/" && "active"
                            }`}
                          >
                            Left Sidebar
                          </Link>
                        </li>

                        <li className="nav-item">
                          <Link
                            href="/vertical-listings-right-sidebar/"
                            className={`nav-link ${
                              currentPath ==
                                "/vertical-listings-right-sidebar/" && "active"
                            }`}
                          >
                            Right Sidebar
                          </Link>
                        </li>

                        <li className="nav-item">
                          <Link
                            href="/vertical-listings-full-width/"
                            className={`nav-link ${
                              currentPath == "/vertical-listings-full-width/" &&
                              "active"
                            }`}
                          >
                            Full Width
                          </Link>
                        </li>

                        <li className="nav-item">
                          <Link
                            href="/vertical-listings-with-map/"
                            className={`nav-link ${
                              currentPath == "/vertical-listings-with-map/" &&
                              "active"
                            }`}
                          >
                            Full Width + Map
                          </Link>
                        </li>

                        <li className="nav-item">
                          <Link
                            href="/vertical-listings-full-map/"
                            className={`nav-link ${
                              currentPath == "/vertical-listings-full-map/" &&
                              "active"
                            }`}
                          >
                            Full Width + Full Map
                          </Link>
                        </li>
                      </ul>
                    </li>

                    <li className="nav-item">
                      <Link href="#" className="nav-link">
                        Grid Layout <i className="bx bx-chevron-right"></i>
                      </Link>

                      <ul className="dropdown-menu">
                        <li className="nav-item">
                          <Link
                            href="/grid-listings-with-left-sidebar/"
                            className={`nav-link ${
                              currentPath ==
                                "/grid-listings-with-left-sidebar/" && "active"
                            }`}
                          >
                            Left Sidebar
                          </Link>
                        </li>

                        <li className="nav-item">
                          <Link
                            href="/grid-listings-with-right-sidebar/"
                            className={`nav-link ${
                              currentPath ==
                                "/grid-listings-with-right-sidebar/" && "active"
                            }`}
                          >
                            Right Sidebar
                          </Link>
                        </li>

                        <li className="nav-item">
                          <Link
                            href="/grid-listings-full-width/"
                            className={`nav-link ${
                              currentPath == "/grid-listings-full-width/" &&
                              "active"
                            }`}
                          >
                            Full Width
                          </Link>
                        </li>

                        <li className="nav-item">
                          <Link
                            href="/grid-listings-with-map/"
                            className={`nav-link ${
                              currentPath == "/grid-listings-with-map/" &&
                              "active"
                            }`}
                          >
                            Full Width + Map
                          </Link>
                        </li>

                        <li className="nav-item">
                          <Link
                            href="/grid-listings-full-map/"
                            className={`nav-link ${
                              currentPath == "/grid-listings-full-map/" &&
                              "active"
                            }`}
                          >
                            Full Width + Full Map
                          </Link>
                        </li>
                      </ul>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/single-listings/"
                        className={`nav-link ${
                          currentPath == "/single-listings/" && "active"
                        }`}
                      >
                        Listings Details
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/destinations/"
                        className={`nav-link ${
                          currentPath == "/destinations/" && "active"
                        }`}
                      >
                        Top Place
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/categories/"
                        className={`nav-link ${
                          currentPath == "/categories/" && "active"
                        }`}
                      >
                        Categories
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/user-profile/"
                        className={`nav-link ${
                          currentPath == "/user-profile/" && "active"
                        }`}
                      >
                        Author Profile
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="nav-item">
                  <Link href="#" className="dropdown-toggle nav-link">
                    User Panel
                  </Link>

                  <ul className="dropdown-menu">
                    <li className="nav-item">
                      <Link
                        href="/dashboard/"
                        className={`nav-link ${
                          currentPath == "/dashboard/" && "active"
                        }`}
                      >
                        Dashboard
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/dashboard/messages/"
                        className={`nav-link ${
                          currentPath == "/dashboard/messages/" && "active"
                        }`}
                      >
                        Messages
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/dashboard/bookings/"
                        className={`nav-link ${
                          currentPath == "/dashboard/bookings/" && "active"
                        }`}
                      >
                        Bookings
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/dashboard/wallet/"
                        className={`nav-link ${
                          currentPath == "/dashboard/wallet/" && "active"
                        }`}
                      >
                        Wallet
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/dashboard/my-listing/active/"
                        className={`nav-link ${
                          currentPath == "/dashboard/my-listing/active/" &&
                          "active"
                        }`}
                      >
                        My Listings
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/dashboard/reviews/"
                        className={`nav-link ${
                          currentPath == "/dashboard/reviews/" && "active"
                        }`}
                      >
                        Reviews
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/dashboard/bookmarks/"
                        className={`nav-link ${
                          currentPath == "/dashboard/bookmarks/" && "active"
                        }`}
                      >
                        Bookmarks
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/dashboard/add-listing/"
                        className={`nav-link ${
                          currentPath == "/dashboard/add-listing/" && "active"
                        }`}
                      >
                        Add Listings
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/dashboard/profile/"
                        className={`nav-link ${
                          currentPath == "/dashboard/profile/" && "active"
                        }`}
                      >
                        My Profile
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/dashboard/invoice/"
                        className={`nav-link ${
                          currentPath == "/dashboard/invoice/" && "active"
                        }`}
                      >
                        Invoice
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="nav-item">
                  <Link href="#" className="dropdown-toggle nav-link">
                    Shop
                  </Link>

                  <ul className="dropdown-menu">
                    <li className="nav-item">
                      <Link
                        href="/shop/"
                        className={`nav-link ${
                          currentPath == "/shop/" && "active"
                        }`}
                      >
                        Products List
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/cart/"
                        className={`nav-link ${
                          currentPath == "/cart/" && "active"
                        }`}
                      >
                        Cart
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/checkout/"
                        className={`nav-link ${
                          currentPath == "/checkout/" && "active"
                        }`}
                      >
                        Checkout
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/product-details/"
                        className={`nav-link ${
                          currentPath == "/product-details/" && "active"
                        }`}
                      >
                        Products Details
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="nav-item">
                  <Link href="#" className="dropdown-toggle nav-link">
                    Blog
                  </Link>

                  <ul className="dropdown-menu">
                    <li className="nav-item">
                      <Link
                        href="/blog-1/"
                        className={`nav-link ${
                          currentPath == "/blog-1/" && "active"
                        }`}
                      >
                        Grid (2 in Row)
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/blog-2/"
                        className={`nav-link ${
                          currentPath == "/blog-2/" && "active"
                        }`}
                      >
                        Grid (3 in Row)
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/blog-3/"
                        className={`nav-link ${
                          currentPath == "/blog-3/" && "active"
                        }`}
                      >
                        Grid (Full Width)
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/blog-4/"
                        className={`nav-link ${
                          currentPath == "/blog-4/" && "active"
                        }`}
                      >
                        Right Sidebar
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/blog-5/"
                        className={`nav-link ${
                          currentPath == "/blog-5/" && "active"
                        }`}
                      >
                        Left Sidebar
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link href="#" className="nav-link">
                        Single Post <i className="bx bx-chevron-right"></i>
                      </Link>

                      <ul className="dropdown-menu">
                        <li className="nav-item">
                          <Link
                            href="/single-blog-1/"
                            className={`nav-link ${
                              currentPath == "/single-blog-1/" && "active"
                            }`}
                          >
                            Default
                          </Link>
                        </li>

                        <li className="nav-item">
                          <Link
                            href="/single-blog-2/"
                            className={`nav-link ${
                              currentPath == "/single-blog-2/" && "active"
                            }`}
                          >
                            With Video
                          </Link>
                        </li>

                        <li className="nav-item">
                          <Link
                            href="/single-blog-3/"
                            className={`nav-link ${
                              currentPath == "/single-blog-3/" && "active"
                            }`}
                          >
                            With Image Slider
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>

                <li className="nav-item">
                  <Link href="#" className="dropdown-toggle nav-link">
                    Pages
                  </Link>

                  <ul className="dropdown-menu">
                    <li className="nav-item">
                      <Link
                        href="/about/"
                        className={`nav-link ${
                          currentPath == "/about/" && "active"
                        }`}
                      >
                        About Us
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/how-it-works/"
                        className={`nav-link ${
                          currentPath == "/how-it-works/" && "active"
                        }`}
                      >
                        How It Work
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/pricing/"
                        className={`nav-link ${
                          currentPath == "/pricing/" && "active"
                        }`}
                      >
                        Pricing
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/gallery/"
                        className={`nav-link ${
                          currentPath == "/gallery/" && "active"
                        }`}
                      >
                        Gallery
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link href="#" className="nav-link">
                        Events <i className="bx bx-chevron-right"></i>
                      </Link>

                      <ul className="dropdown-menu">
                        <li className="nav-item">
                          <Link
                            href="/events/"
                            className={`nav-link ${
                              currentPath == "/events/" && "active"
                            }`}
                          >
                            Events
                          </Link>
                        </li>

                        <li className="nav-item">
                          <Link
                            href="/single-events/"
                            className={`nav-link ${
                              currentPath == "/single-events/" && "active"
                            }`}
                          >
                            Events Details
                          </Link>
                        </li>
                      </ul>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/testimonial/"
                        className={`nav-link ${
                          currentPath == "/testimonial/" && "active"
                        }`}
                      >
                        Testimonials
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/faq/"
                        className={`nav-link ${
                          currentPath == "/faq/" && "active"
                        }`}
                      >
                        FAQ
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/404/"
                        className={`nav-link ${
                          currentPath == "/404/" && "active"
                        }`}
                      >
                        404 Error
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/coming-soon/"
                        className={`nav-link ${
                          currentPath == "/coming-soon/" && "active"
                        }`}
                      >
                        Coming Soon
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        href="/contact/"
                        className={`nav-link ${
                          currentPath == "/contact/" && "active"
                        }`}
                      >
                        Contact
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>

              <div className="others-option d-flex align-items-center">
                <div className="option-item">
                  <div className="dropdown profile-nav-item menu-profile-one">
                    <Link
                      href="#"
                      className="dropdown-toggle"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <div className="menu-profile">
                        <img
                          src="/images/user1.jpg"
                          className="rounded-circle"
                          alt="image"
                        />
                        <span className="name" onClick={toggleDropdownProfile}>
                          My Account
                        </span>
                      </div>
                    </Link>

                    <div
                      className={
                        displayDropdownProfile
                          ? "dropdown-menu show"
                          : "dropdown-menu"
                      }
                    >
                      <div className="dropdown-header d-flex flex-column align-items-center">
                        <div className="figure mb-3">
                          <img
                            src="/images/user1.jpg"
                            className="rounded-circle"
                            alt="image"
                          />
                        </div>

                        <div className="info text-center">
                          <span className="name">Andy Smith</span>
                          <p className="mb-3 email">hello@androsmith.com</p>
                        </div>
                      </div>

                      <div className="dropdown-body">
                        <ul className="profile-nav p-0 pt-3">
                          <li className="nav-item">
                            <Link href="/dashboard/" className="nav-link">
                              <i className="bx bx-user"></i>{" "}
                              <span>Dashboard</span>
                            </Link>
                          </li>

                          <li className="nav-item">
                            <Link
                              href="/dashboard/messages/"
                              className="nav-link"
                            >
                              <i className="bx bx-envelope"></i>
                              <span>Messages</span>
                            </Link>
                          </li>

                          <li className="nav-item">
                            <Link
                              href="/dashboard/bookings"
                              className="nav-link"
                            >
                              <i className="bx bx-edit-alt"></i>{" "}
                              <span>Bookings</span>
                            </Link>
                          </li>

                          <li className="nav-item">
                            <Link
                              href="/dashboard/profile/"
                              className="nav-link"
                            >
                              <i className="bx bx-cog"></i>{" "}
                              <span>Settings</span>
                            </Link>
                          </li>
                        </ul>
                      </div>

                      <div className="dropdown-footer">
                        <ul className="profile-nav">
                          <li className="nav-item">
                            <Link href="/" className="nav-link">
                              <i className="bx bx-log-out"></i>{" "}
                              <span>Logout</span>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="option-item">
                  <Link
                    href="/dashboard/add-listing"
                    className="default-btn button-one"
                  >
                    <i className="flaticon-more"></i> Add Listing
                  </Link>
                </div>
              </div>
            </div>
          </nav>
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
                  <div className="option-item">
                    <div className="dropdown profile-nav-item">
                      <Link
                        href="#"
                        className="dropdown-toggle"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <div className="menu-profile">
                          <img
                            src="/images/user1.jpg"
                            className="rounded-circle"
                            alt="image"
                          />
                          <span
                            className="name"
                            onClick={toggleDropdownProfile}
                          >
                            My Account
                          </span>
                        </div>
                      </Link>

                      <div
                        className={
                          displayDropdownProfile
                            ? "dropdown-menu show"
                            : "dropdown-menu"
                        }
                      >
                        <div className="dropdown-header d-flex flex-column align-items-center">
                          <div className="figure mb-3">
                            <img
                              src="/images/user1.jpg"
                              className="rounded-circle"
                              alt="image"
                            />
                          </div>

                          <div className="info text-center">
                            <span className="name">Andy Smith</span>
                            <p className="mb-3 email">hello@androsmith.com</p>
                          </div>
                        </div>

                        <div className="dropdown-body">
                          <ul className="profile-nav p-0 pt-3">
                            <li className="nav-item">
                              <Link href="/" className="nav-link">
                                <i className="bx bx-user"></i>{" "}
                                <span>Dashboard</span>
                              </Link>
                            </li>

                            <li className="nav-item">
                              <Link
                                href="/dashboard/messages/"
                                className="nav-link"
                              >
                                <i className="bx bx-envelope"></i>{" "}
                                <span>Messages</span>
                              </Link>
                            </li>

                            <li className="nav-item">
                              <Link
                                href="/dashboard/bookmarks/"
                                className="nav-link"
                              >
                                <i className="bx bx-edit-alt"></i>{" "}
                                <span>Bookings</span>
                              </Link>
                            </li>

                            <li className="nav-item">
                              <Link
                                href="/dashboard/profile/"
                                className="nav-link"
                              >
                                <i className="bx bx-cog"></i>{" "}
                                <span>Settings</span>
                              </Link>
                            </li>
                          </ul>
                        </div>

                        <div className="dropdown-footer">
                          <ul className="profile-nav">
                            <li className="nav-item">
                              <Link href="/" className="nav-link">
                                <i className="bx bx-log-out"></i>{" "}
                                <span>Logout</span>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="option-item">
                    <Link href="/dashboard/add-listing" className="default-btn">
                      <i className="flaticon-more"></i> Add Listing
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarThree;
