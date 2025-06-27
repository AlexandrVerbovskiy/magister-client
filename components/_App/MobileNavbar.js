import { useRouter } from "next/router";
import { useListingListClick } from "../../hooks";
import { useContext, useEffect, useState } from "react";
import { IndiceContext } from "../../contexts";
import Link from "next/link";
import SignOutModal from "./SignOutModal";

const MobileNavbar = ({ onLoginClick = null }) => {
  const router = useRouter();

  const { handleClick: handleListingListClick } = useListingListClick();
  const { handleClick: handleListingCreateClick } = useListingListClick({
    link: "/dashboard/listings/add",
  });
  const { handleClick: handleChatClick } = useListingListClick({
    link: "/dashboard/chats",
  });
  const { handleClick: handleOrdersClick } = useListingListClick({
    link: "/dashboard/orders",
  });

  const isHomePage = router.pathname === "/";
  const isListings = router.pathname === "/listings";
  const isOwnerListings = router.pathname.startsWith("/owner-listings");
  const isDashboardOrders = router.pathname.startsWith("/dashboard/orders");
  const isDashboardChats = router.pathname.startsWith("/dashboard/chats");

  const [currentPath, setCurrentPath] = useState("");
  const [signOutModalActive, setSignOutModalActive] = useState(false);

  useEffect(() => {
    setCurrentPath(router.asPath);
  }, [router]);

  if (!onLoginClick) {
    onLoginClick = () => router.push("/sign-in");
  }

  const { isAuth, isSupport, toggleSideMenu, displaySideMenu } =
    useContext(IndiceContext);

  return (
    <>
      <div className="mobile-footer position-fixed d-xl-none">
        <div className="container">
          <button
            type="button"
            onClick={() => {
              router.push("/");
              toggleSideMenu();
            }}
            className={isHomePage ? "active" : ""}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 36 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18.168 4.74706L26.918 12.6882V26.4706H23.418V15.8824H12.918V26.4706H9.41797V12.6882L18.168 4.74706ZM18.168 0L0.667969 15.8824H5.91797V30H16.418V19.4118H19.918V30H30.418V15.8824H35.668L18.168 0Z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleListingListClick}
            className={isListings || isOwnerListings ? "active" : ""}
          >
            <svg
              width="18"
              height="20"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.8333 18.3333H19.5167L19.05 17.8833C20.6833 15.9833 21.6667 13.5167 21.6667 10.8333C21.6667 4.85 16.8167 0 10.8333 0C4.85 0 0 4.85 0 10.8333C0 16.8167 4.85 21.6667 10.8333 21.6667C13.5167 21.6667 15.9833 20.6833 17.8833 19.05L18.3333 19.5167V20.8333L26.6667 29.15L29.15 26.6667L20.8333 18.3333ZM10.8333 18.3333C6.68333 18.3333 3.33333 14.9833 3.33333 10.8333C3.33333 6.68333 6.68333 3.33333 10.8333 3.33333C14.9833 3.33333 18.3333 6.68333 18.3333 10.8333C18.3333 14.9833 14.9833 18.3333 10.8333 18.3333Z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleOrdersClick}
            className={isDashboardOrders ? "active" : ""}
          >
            <svg
              width="18"
              height="20"
              viewBox="0 0 29 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.9987 2H27.332M8.9987 12H27.332M8.9987 22H27.332M2.33203 2V2.01667M2.33203 12V12.0167M2.33203 22V22.0167"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleChatClick}
            className={isDashboardChats ? "active" : ""}
          >
            <svg
              width="18"
              height="20"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M27 0H3C1.35 0 0 1.35 0 3V30L6 24H27C28.65 24 30 22.65 30 21V3C30 1.35 28.65 0 27 0ZM27 21H6L3 24V3H27V21Z" />
            </svg>
          </button>
          <button
            type="button"
            className={displaySideMenu ? "active" : ""}
            onClick={toggleSideMenu}
          >
            <svg
              width="21"
              height="20"
              viewBox="0 0 34 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M30.7496 18.95V17.0375L33.1496 14.9375C33.592 14.5476 33.8823 14.0138 33.9692 13.4305C34.0561 12.8472 33.9341 12.252 33.6246 11.75L30.6746 6.75002C30.4554 6.37035 30.1402 6.055 29.7606 5.8356C29.3811 5.6162 28.9505 5.50047 28.5121 5.50002C28.2404 5.49794 27.9702 5.54016 27.7121 5.62502L24.6746 6.65002C24.1509 6.30039 23.6037 5.98716 23.0371 5.71252L22.3996 2.56252C22.2853 1.98703 21.9722 1.47007 21.5152 1.10215C21.0581 0.734225 20.4862 0.538778 19.8996 0.55002H14.0496C13.463 0.538778 12.8911 0.734225 12.434 1.10215C11.977 1.47007 11.6639 1.98703 11.5496 2.56252L10.9121 5.71252C10.342 5.98834 9.79083 6.30152 9.26208 6.65002L6.28708 5.57502C6.0262 5.50705 5.75605 5.48172 5.48708 5.50002C5.04868 5.50047 4.6181 5.6162 4.23854 5.8356C3.85898 6.055 3.54379 6.37035 3.32458 6.75002L0.374583 11.75C0.082817 12.2513 -0.0256022 12.8383 0.0678948 13.4107C0.161392 13.9831 0.450987 14.5052 0.887083 14.8875L3.24958 17.05V18.9625L0.887083 21.0625C0.438669 21.4475 0.141153 21.9789 0.0473315 22.5625C-0.0464895 23.146 0.0694531 23.7439 0.374583 24.25L3.32458 29.25C3.54379 29.6297 3.85898 29.945 4.23854 30.1644C4.6181 30.3838 5.04868 30.4996 5.48708 30.5C5.75877 30.5021 6.02898 30.4599 6.28708 30.375L9.32458 29.35C9.8483 29.6996 10.3954 30.0129 10.9621 30.2875L11.5996 33.4375C11.7139 34.013 12.027 34.53 12.484 34.8979C12.9411 35.2658 13.513 35.4613 14.0996 35.45H19.9996C20.5862 35.4613 21.1581 35.2658 21.6151 34.8979C22.0722 34.53 22.3853 34.013 22.4996 33.4375L23.1371 30.2875C23.7071 30.0117 24.2583 29.6985 24.7871 29.35L27.8121 30.375C28.0702 30.4599 28.3404 30.5021 28.6121 30.5C29.0505 30.4996 29.4811 30.3838 29.8606 30.1644C30.2402 29.945 30.5554 29.6297 30.7746 29.25L33.6246 24.25C33.9163 23.7488 34.0248 23.1617 33.9313 22.5893C33.8378 22.0169 33.5482 21.4949 33.1121 21.1125L30.7496 18.95ZM28.5121 28L24.2246 26.55C23.2203 27.3993 22.0734 28.0637 20.8371 28.5125L19.9496 33H14.0496L13.1621 28.5625C11.9355 28.1011 10.7948 27.4378 9.78708 26.6L5.48708 28L2.53708 23L5.93708 20C5.70595 18.7061 5.70595 17.3814 5.93708 16.0875L2.53708 13L5.48708 8.00002L9.77458 9.45002C10.7789 8.60076 11.9258 7.9363 13.1621 7.48752L14.0496 3.00002H19.9496L20.8371 7.43752C22.0636 7.8989 23.2044 8.56222 24.2121 9.40002L28.5121 8.00002L31.4621 13L28.0621 16C28.2932 17.2939 28.2932 18.6186 28.0621 19.9125L31.4621 23L28.5121 28Z" />
              <path d="M17 25.5C15.5166 25.5 14.0666 25.0601 12.8332 24.236C11.5999 23.4119 10.6386 22.2406 10.0709 20.8701C9.50325 19.4997 9.35472 17.9917 9.64411 16.5368C9.9335 15.082 10.6478 13.7456 11.6967 12.6967C12.7456 11.6478 14.082 10.9335 15.5368 10.6441C16.9917 10.3547 18.4997 10.5032 19.8701 11.0709C21.2406 11.6386 22.4119 12.5999 23.236 13.8332C24.0601 15.0666 24.5 16.5166 24.5 18C24.51 18.9877 24.3229 19.9675 23.9495 20.882C23.5762 21.7964 23.0241 22.6272 22.3257 23.3257C21.6272 24.0241 20.7964 24.5762 19.882 24.9495C18.9675 25.3229 17.9877 25.51 17 25.5ZM17 13C16.3392 12.9846 15.6821 13.1034 15.0685 13.3492C14.4549 13.5951 13.8976 13.9628 13.4302 14.4302C12.9628 14.8976 12.5951 15.4549 12.3492 16.0685C12.1034 16.6821 11.9846 17.3392 12 18C11.9846 18.6608 12.1034 19.3179 12.3492 19.9315C12.5951 20.5451 12.9628 21.1024 13.4302 21.5698C13.8976 22.0372 14.4549 22.4049 15.0685 22.6508C15.6821 22.8966 16.3392 23.0154 17 23C17.6608 23.0154 18.3179 22.8966 18.9315 22.6508C19.5451 22.4049 20.1024 22.0372 20.5698 21.5698C21.0372 21.1024 21.4049 20.5451 21.6508 19.9315C21.8966 19.3179 22.0154 18.6608 22 18C22.0154 17.3392 21.8966 16.6821 21.6508 16.0685C21.4049 15.4549 21.0372 14.8976 20.5698 14.4302C20.1024 13.9628 19.5451 13.5951 18.9315 13.3492C18.3179 13.1034 17.6608 12.9846 17 13Z" />
            </svg>
          </button>
        </div>
      </div>

      <div
        className={
          "sidemenu-area d-xl-none w-100 " +
          (displaySideMenu ? "active-sidemenu-area" : "")
        }
      >
        <div className="sidemenu-header">
          <Link
            href="/"
            className="navbar-brand d-flex align-items-center"
            onClick={toggleSideMenu}
          >
            <img
              src="/images/logo-black.svg"
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
              <Link onClick={toggleSideMenu} href="/" className="nav-link">
                <span className="icon">
                  <i className="bx bx-home"></i>
                </span>
                <span className="menu-title">Home</span>
              </Link>
            </li>

            <li className="nav-item">
              <a
                onClick={(e) => {
                  e.preventDefault();
                  handleListingListClick();
                  toggleSideMenu();
                }}
                href="#"
                className={`nav-link d-block d-xl-none`}
              >
                <span className="icon">
                  <i className="bx bx-task"></i>
                </span>
                <span className="menu-title">Search Items</span>
              </a>
            </li>

            <li className="nav-item">
              <a
                onClick={(e) => {
                  e.preventDefault();
                  handleListingCreateClick();
                  toggleSideMenu();
                }}
                href="#"
                className={`nav-link d-block d-xl-none`}
              >
                <span className="icon">
                  <i className="bx bx-wrench"></i>
                </span>
                <span className="menu-title">Listings</span>
              </a>
            </li>

            {isSupport ? (
              <li className="nav-item">
                <Link
                  onClick={toggleSideMenu}
                  href="/admin/"
                  className="nav-link"
                >
                  <span className="icon">
                    <i className="bx bx-cog"></i>{" "}
                  </span>
                  <span className="menu-title">Admin Section</span>
                </Link>
              </li>
            ) : (
              <li className="nav-item">
                <Link
                  onClick={toggleSideMenu}
                  href="/how-it-works/"
                  className="nav-link"
                >
                  <span className="icon">
                    <i className="bx bx-info-circle"></i>{" "}
                  </span>
                  <span className="menu-title">How it works</span>
                </Link>
              </li>
            )}

            {isAuth && (
              <>
                <li className="nav-item-title">Dashboard</li>

                <li className="nav-item">
                  <Link
                    onClick={toggleSideMenu}
                    href="/dashboard/"
                    className={`nav-link ${
                      currentPath == "/dashboard/" && "active"
                    }`}
                  >
                    <span className="icon">
                      <i className="bx bx-tachometer"></i>
                    </span>
                    <span className="menu-title">Dashboard</span>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    onClick={toggleSideMenu}
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
                  <Link
                    onClick={toggleSideMenu}
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
                    onClick={toggleSideMenu}
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
                    onClick={toggleSideMenu}
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
                    onClick={toggleSideMenu}
                  >
                    <span className="icon">
                      <i className="bx bx-user-circle"></i>
                    </span>
                    <span className="menu-title">Profile</span>
                  </Link>
                </li>
              </>
            )}

            {isAuth ? (
              <li className="nav-item">
                <Link
                  href="#"
                  className={`nav-link`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleSideMenu();
                    setSignOutModalActive(true);
                  }}
                >
                  <span className="icon">
                    <i className="bx bx-log-out"></i>{" "}
                  </span>
                  <span className="menu-title">Sign Out</span>
                </Link>
              </li>
            ) : (
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link`}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleSideMenu();
                    onLoginClick();
                  }}
                >
                  <span className="icon">
                    <i className="bx bx-log-in"></i>{" "}
                  </span>
                  <span className="menu-title">Sign In</span>
                </button>
              </li>
            )}
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

export default MobileNavbar;
