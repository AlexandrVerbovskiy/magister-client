import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

const NavbarTwo = () => {
  // Add active class
  const [currentPath, setCurrentPath] = useState("");
  const router = useRouter();

  useEffect(() => {
    setCurrentPath(router.asPath);
  }, [router]);

  const [displayAuth, setDisplayAuth] = useState(false);
  const [displayMiniAuth, setDisplayMiniAuth] = useState(false);
  const [sticky, setSticky] = useState(false);

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
  };

  const toggleMiniAuth = () => {
    setDisplayMiniAuth(!displayMiniAuth);
  };

  const [showMenu, setshowMenu] = useState(false);

  const toggleMenu = () => {
    setshowMenu(!showMenu);
  };

  useEffect(() => {
    let abortController = new AbortController();
    // your async action is here
    return () => {
      abortController.abort();
    };
  }, []);

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
                <Link href="/index-2">
                  <img src="/images/black-logo.png" alt="logo" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className={showMenu ? "miran-nav show" : "miran-nav"}>
          <div className="container-fluid">
            <nav className="navbar navbar-expand-md navbar-light">
              <Link href="/index-2" className="navbar-brand">
                <img src="/images/black-logo.png" alt="logo" />
              </Link>
              <div className="collapse navbar-collapse mean-menu">
                <form className="navbar-search-box search-box-one">
                  <label>
                    <i className="flaticon-search"></i>
                  </label>
                  <input
                    type="text"
                    className="input-search"
                    placeholder="What are you looking for?"
                  />
                </form>

                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link href="#" className="dropdown-toggle nav-link">
                      Home
                    </Link>

                    <ul className="dropdown-menu">
                      <li className="nav-item">
                        <Link
                          href="/"
                          className={`nav-link ${
                            currentPath == "/" && "active"
                          }`}
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
                                  "/vertical-listings-right-sidebar/" &&
                                "active"
                              }`}
                            >
                              Right Sidebar
                            </Link>
                          </li>

                          <li className="nav-item">
                            <Link
                              href="/vertical-listings-full-width/"
                              className={`nav-link ${
                                currentPath ==
                                  "/vertical-listings-full-width/" && "active"
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
                                  "/grid-listings-with-left-sidebar/" &&
                                "active"
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
                                  "/grid-listings-with-right-sidebar/" &&
                                "active"
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
                    <span
                      data-toggle="modal"
                      onClick={toggleAuth}
                      className="auth-one"
                    >
                      <i className="flaticon-user"></i> Login / Register
                    </span>
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
                    <form className="navbar-search-box">
                      <label>
                        <i className="flaticon-search"></i>
                      </label>
                      <input
                        type="text"
                        className="input-search"
                        placeholder="What are you looking for?"
                      />
                    </form>
                  </div>

                  <div className="option-item">
                    <span
                      data-toggle="modal"
                      data-target="#loginRegisterModal"
                      onClick={toggleAuth}
                    >
                      <i className="flaticon-user"></i> Login / Register
                    </span>
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

      {/* ------------ Auth Modal ------- */}
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
                    <a className="nav-link" id="login-tab">
                      Login
                    </a>
                  </Tab>
                  <Tab className="nav-item">
                    <a className="nav-link" id="register-tab">
                      Register
                    </a>
                  </Tab>
                </TabList>
              </ul>

              <div className="tab-content" id="myTabContent">
                <TabPanel>
                  <div className="tab-pane fade show active" id="login">
                    <div className="miran-login">
                      <div className="login-with-account">
                        <span>Login with</span>
                        <ul>
                          <li>
                            <a href="#" className="facebook" target="_blank">
                              <i className="bx bxl-facebook"></i> Facebook
                            </a>
                          </li>
                          <li>
                            <a href="#" className="twitter" target="_blank">
                              <i className="bx bxl-twitter"></i> Twitter
                            </a>
                          </li>
                        </ul>
                      </div>

                      <span className="sub-title">
                        <span>Or login with</span>
                      </span>

                      <form>
                        <div className="form-group">
                          <input
                            type="text"
                            placeholder="Username or Email"
                            className="form-control"
                          />
                        </div>

                        <div className="form-group">
                          <input
                            type="password"
                            placeholder="Password"
                            className="form-control"
                          />
                        </div>

                        <button type="submit">Register Now</button>
                      </form>

                      <span className="dont-account">
                        Don&apos;t have an account? <a href="#">Register Now</a>
                      </span>
                    </div>
                  </div>
                </TabPanel>

                <TabPanel>
                  <div className="tab-pane" id="register">
                    <div className="miran-register">
                      <div className="register-with-account">
                        <span>Register with</span>
                        <ul>
                          <li>
                            <a href="#" className="facebook" target="_blank">
                              <i className="bx bxl-facebook"></i> Facebook
                            </a>
                          </li>
                          <li>
                            <a href="#" className="twitter" target="_blank">
                              <i className="bx bxl-twitter"></i> Twitter
                            </a>
                          </li>
                        </ul>
                      </div>

                      <span className="sub-title">
                        <span>Or Register with</span>
                      </span>

                      <form>
                        <div className="form-group">
                          <input
                            type="text"
                            placeholder="Username"
                            className="form-control"
                          />
                        </div>

                        <div className="form-group">
                          <input
                            type="email"
                            placeholder="Email"
                            className="form-control"
                          />
                        </div>

                        <div className="form-group">
                          <input
                            type="password"
                            placeholder="Password"
                            className="form-control"
                          />
                        </div>

                        <div className="form-group">
                          <input
                            type="password"
                            placeholder="Confirm Password"
                            className="form-control"
                          />
                        </div>

                        <button type="submit">Register Now</button>
                      </form>

                      <span className="already-account">
                        Already have an account? <a href="#">Login Now</a>
                      </span>
                    </div>
                  </div>
                </TabPanel>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarTwo;
