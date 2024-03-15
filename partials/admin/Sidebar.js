import React, { useState, useEffect, useRef, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import SidebarLinkGroup from "./SidebarLinkGroup";
import { IndiceContext } from "../../contexts";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const trigger = useRef(null);
  const sidebar = useRef(null);
  const { isAdmin } = useContext(IndiceContext);

  const [currentPath, setCurrentPath] = useState("");
  const router = useRouter();

  useEffect(() => {
    setCurrentPath(router.asPath);
  }, [router]);

  const isCurrentPath = (link = null) => {
    if (!link) return currentPath === "/admin/";

    return currentPath.includes("/admin/" + link);
  };

  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
    setSidebarExpanded(
      storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
    );
  }, []);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);

    if (sidebarExpanded) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded, currentPath]);

  return (
    <div className="min-w-fit">
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-slate-800 p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-slate-500 hover:text-slate-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <img
              src="/images/rent-about-logo.png"
              className="logo-image"
              alt="logo"
            />
          </button>
          {/* Logo */}
          <Link href="/" className="block w-full">
            <div className="adaptive-logo-image" />
          </Link>
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            <h3 className="text-xs uppercase text-slate-500 font-semibold pl-3">
              <span
                className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6"
                aria-hidden="true"
              >
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                Pages
              </span>
            </h3>
            <ul className="mt-3">
              {/* Main */}
              <li
                className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                  isCurrentPath() && "bg-slate-900"
                }`}
              >
                <Link
                  href="/admin"
                  className={`block text-slate-200 truncate transition duration-150 ${
                    isCurrentPath()
                      ? "hover:text-slate-200"
                      : "hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        width="24"
                        viewBox="0 0 20 20"
                      >
                        <title>house 5</title>
                        <g fill="none" className="nc-icon-wrapper">
                          <path
                            d="M13.75,6.019c-.414,0-.75-.336-.75-.75V2.75c0-.414,.336-.75,.75-.75s.75,.336,.75,.75v2.519c0,.414-.336,.75-.75,.75Z"
                            data-color="color-2"
                          ></path>
                          <path
                            d="M15.792,5.848L9.446,1.147c-.265-.196-.628-.196-.893,0L2.208,5.848c-.444,.329-.708,.854-.708,1.406v6.496c0,1.517,1.233,2.75,2.75,2.75h.75v-5c0-.828,.672-1.5,1.5-1.5s1.5,.672,1.5,1.5v5h5.75c1.517,0,2.75-1.233,2.75-2.75V7.254c0-.552-.265-1.078-.708-1.406Zm-3.542,4.652h-1.5c-.414,0-.75-.336-.75-.75s.336-.75,.75-.75h1.5c.414,0,.75,.336,.75,.75s-.336,.75-.75,.75Z"
                            className={`stroke-current ${
                              isCurrentPath()
                                ? "text-indigo-500"
                                : "text-slate-600"
                            }`}
                          ></path>
                        </g>
                      </svg>

                      <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                        Main
                      </span>
                    </div>
                  </div>
                </Link>
              </li>

              {/* Users */}
              <li
                className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                  isCurrentPath("users") && "bg-slate-900"
                }`}
              >
                <Link
                  href="/admin/users"
                  className={`block text-slate-200 truncate transition duration-150 ${
                    isCurrentPath("users")
                      ? "hover:text-slate-200"
                      : "hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        width="24"
                        viewBox="0 0 20 20"
                      >
                        <title>users</title>
                        <g fill="none" className="nc-icon-wrapper">
                          <circle
                            cx="5.75"
                            cy="6.25"
                            r="2.75"
                            className={`stroke-current ${
                              isCurrentPath("users")
                                ? "text-indigo-500"
                                : "text-slate-600"
                            }`}
                          ></circle>
                          <circle
                            cx="12"
                            cy="3.75"
                            r="2.75"
                            className={`stroke-current ${
                              isCurrentPath("users")
                                ? "text-indigo-500"
                                : "text-slate-600"
                            }`}
                          ></circle>
                          <path
                            d="M17.196,11.098c-.811-2.152-2.899-3.598-5.196-3.598-1.417,0-2.752,.553-3.759,1.48,1.854,.709,3.385,2.169,4.109,4.089,.112,.296,.162,.603,.182,.91,1.211-.05,2.409-.26,3.565-.646,.456-.152,.834-.487,1.041-.919,.2-.42,.221-.888,.059-1.316Z"
                            className={`stroke-current ${
                              isCurrentPath("users")
                                ? "text-indigo-500"
                                : "text-slate-600"
                            }`}
                          ></path>
                          <path
                            d="M10.946,13.598c-.811-2.152-2.899-3.598-5.196-3.598S1.365,11.446,.554,13.598c-.162,.429-.141,.896,.059,1.316,.206,.432,.585,.767,1.041,.919,1.325,.442,2.704,.667,4.096,.667s2.771-.225,4.096-.667c.456-.152,.834-.487,1.041-.919,.2-.42,.221-.888,.059-1.316Z"
                            className={`stroke-current ${
                              isCurrentPath("users")
                                ? "text-indigo-500"
                                : "text-slate-600"
                            }`}
                          ></path>
                        </g>
                      </svg>

                      <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                        Users
                      </span>
                    </div>
                  </div>
                </Link>
              </li>

              {/* Users Verify Request */}
              <li
                className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                  isCurrentPath("user-verify-requests") && "bg-slate-900"
                }`}
              >
                <Link
                  href="/admin/user-verify-requests"
                  className={`block text-slate-200 truncate transition duration-150 ${
                    isCurrentPath("user-verify-requests")
                      ? "hover:text-slate-200"
                      : "hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        width="24"
                        viewBox="0 0 20 20"
                      >
                        <title>clipboard check</title>
                        <g fill="none" className="nc-icon-wrapper">
                          <path
                            d="M12.75,2h-.275c-.123-.846-.845-1.5-1.725-1.5h-3.5c-.879,0-1.602,.654-1.725,1.5h-.275c-1.517,0-2.75,1.233-2.75,2.75V14.25c0,1.517,1.233,2.75,2.75,2.75h7.5c1.517,0,2.75-1.233,2.75-2.75V4.75c0-1.517-1.233-2.75-2.75-2.75Zm-5.75,.25c0-.138,.112-.25,.25-.25h3.5c.138,0,.25,.112,.25,.25v1c0,.138-.112,.25-.25,.25h-3.5c-.138,0-.25-.112-.25-.25v-1Zm5.35,5.45l-3.75,5c-.136,.181-.346,.291-.572,.299-.009,0-.019,0-.028,0-.216,0-.422-.093-.564-.256l-1.75-2c-.273-.312-.241-.785,.071-1.058s.785-.242,1.058,.071l1.141,1.303,3.195-4.26c.249-.331,.719-.397,1.05-.15,.331,.249,.398,.719,.15,1.05Z"
                            className={`stroke-current ${
                              isCurrentPath("user-verify-requests")
                                ? "text-indigo-500"
                                : "text-slate-600"
                            }`}
                          ></path>
                        </g>
                      </svg>

                      <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                        User Verify Requests
                      </span>
                    </div>
                  </div>
                </Link>
              </li>

              {/* Logs */}
              {isAdmin && (
                <li
                  className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                    isCurrentPath("user-event-logs") && "bg-slate-900"
                  }`}
                >
                  <Link
                    href="/admin/user-event-logs"
                    className={`block text-slate-200 truncate transition duration-150 ${
                      isCurrentPath("user-event-logs")
                        ? "hover:text-slate-200"
                        : "hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24"
                          width="24"
                          viewBox="0 0 20 20"
                        >
                          <title>file content</title>
                          <g fill="none" className="nc-icon-wrapper">
                            <path
                              d="M15.487,5.427l-3.914-3.914c-.331-.331-.77-.513-1.237-.513H4.75c-1.517,0-2.75,1.233-2.75,2.75V14.25c0,1.517,1.233,2.75,2.75,2.75H13.25c1.517,0,2.75-1.233,2.75-2.75V6.664c0-.467-.182-.907-.513-1.237Zm-9.737,.573h2c.414,0,.75,.336,.75,.75s-.336,.75-.75,.75h-2c-.414,0-.75-.336-.75-.75s.336-.75,.75-.75Zm6.5,7.5H5.75c-.414,0-.75-.336-.75-.75s.336-.75,.75-.75h6.5c.414,0,.75,.336,.75,.75s-.336,.75-.75,.75Zm0-3H5.75c-.414,0-.75-.336-.75-.75s.336-.75,.75-.75h6.5c.414,0,.75,.336,.75,.75s-.336,.75-.75,.75Zm2.182-4h-2.932c-.55,0-1-.45-1-1V2.579l.013-.005,3.922,3.921-.002,.005Z"
                              className={`stroke-current ${
                                isCurrentPath("user-event-logs")
                                  ? "text-indigo-500"
                                  : "text-slate-600"
                              }`}
                            ></path>
                          </g>
                        </svg>
                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          User Logs
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              )}

              {/* Listing Categories */}
              {isAdmin && (
                <li
                  className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                    isCurrentPath("listing-categories") && "bg-slate-900"
                  }`}
                >
                  <Link
                    href="/admin/listing-categories"
                    className={`block text-slate-200 truncate transition duration-150 ${
                      isCurrentPath("listing-categories")
                        ? "hover:text-slate-200"
                        : "hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon icon-tabler icon-tabler-tools"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="1"
                          stroke="#2c3e50"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path
                            d="M3 21h4l13 -13a1.5 1.5 0 0 0 -4 -4l-13 13v4"
                            className={`stroke-current ${
                              isCurrentPath("listing-categories")
                                ? "text-indigo-500"
                                : "text-slate-600"
                            }`}
                          />
                          <path
                            d="M14.5 5.5l4 4"
                            className={`stroke-current ${
                              isCurrentPath("listing-categories")
                                ? "text-indigo-500"
                                : "text-slate-600"
                            }`}
                          />
                          <path
                            d="M12 8l-5 -5l-4 4l5 5"
                            className={`stroke-current ${
                              isCurrentPath("listing-categories")
                                ? "text-indigo-500"
                                : "text-slate-600"
                            }`}
                          />
                          <path
                            d="M7 8l-1.5 1.5"
                            className={`stroke-current ${
                              isCurrentPath("listing-categories")
                                ? "text-indigo-500"
                                : "text-slate-600"
                            }`}
                          />
                          <path
                            d="M16 12l5 5l-4 4l-5 -5"
                            className={`stroke-current ${
                              isCurrentPath("listing-categories")
                                ? "text-indigo-500"
                                : "text-slate-600"
                            }`}
                          />
                          <path
                            d="M16 17l-1.5 1.5"
                            className={`stroke-current ${
                              isCurrentPath("listing-categories")
                                ? "text-indigo-500"
                                : "text-slate-600"
                            }`}
                          />
                        </svg>

                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Listing Categories
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              )}

              {/* Listings */}
              {isAdmin && (
                <li
                  className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                    isCurrentPath("listings") && "bg-slate-900"
                  }`}
                >
                  <Link
                    href="/admin/listings"
                    className={`block text-slate-200 truncate transition duration-150 ${
                      isCurrentPath("listings")
                        ? "hover:text-slate-200"
                        : "hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24"
                          width="24"
                          viewBox="0 0 20 20"
                        >
                          <g fill="none" className="nc-icon-wrapper">
                            <path
                              className={`stroke-current ${
                                isCurrentPath("listings")
                                  ? "text-indigo-500"
                                  : "text-slate-600"
                              }`}
                              d="M15.685,4.423L9.816,1.333c-.511-.271-1.121-.27-1.631,0L2.315,4.423c-.494,.26-.801,.769-.801,1.327s.307,1.067,.801,1.327l5.869,3.09c.255,.135,.536,.203,.816,.203s.56-.067,.815-.202l5.87-3.091c.494-.26,.801-.769,.801-1.327s-.307-1.067-.801-1.327Z"
                            ></path>
                            <path
                              className={`stroke-current ${
                                isCurrentPath("listings")
                                  ? "text-indigo-500"
                                  : "text-slate-600"
                              }`}
                              d="M15.736,8.25c-.414,0-.75,.336-.75,.75l-5.87,3.091c-.072,.038-.158,.038-.232,0l-5.87-3.091c0-.414-.336-.75-.75-.75s-.75,.336-.75,.75c0,.559,.307,1.067,.801,1.327l5.869,3.09c.255,.135,.536,.203,.816,.203s.56-.067,.815-.202l5.87-3.091c.494-.26,.801-.769,.801-1.327,0-.414-.336-.75-.75-.75Z"
                              data-color="color-2"
                            ></path>
                            <path
                              className={`stroke-current ${
                                isCurrentPath("listings")
                                  ? "text-indigo-500"
                                  : "text-slate-600"
                              }`}
                              d="M15.736,11.5c-.414,0-.75,.336-.75,.75l-5.87,3.091c-.072,.038-.158,.038-.232,0l-5.87-3.091c0-.414-.336-.75-.75-.75s-.75,.336-.75,.75c0,.559,.307,1.067,.801,1.327l5.869,3.09c.255,.135,.536,.203,.816,.203s.56-.067,.815-.202l5.87-3.091c.494-.26,.801-.769,.801-1.327,0-.414-.336-.75-.75-.75Z"
                              data-color="color-2"
                            ></path>
                          </g>
                        </svg>

                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Listings
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              )}

              {/* Listing Approve Request */}
              {isAdmin && (
                <li
                  className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                    isCurrentPath("listing-approval-requests") && "bg-slate-900"
                  }`}
                >
                  <Link
                    href="/admin/listing-approval-requests"
                    className={`block text-slate-200 truncate transition duration-150 ${
                      isCurrentPath("listing-approval-requests")
                        ? "hover:text-slate-200"
                        : "hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24"
                          width="24"
                          viewBox="0 0 20 20"
                        >
                          <title>clipboard check</title>
                          <g fill="none" className="nc-icon-wrapper">
                            <path
                              d="M12.75,2h-.275c-.123-.846-.845-1.5-1.725-1.5h-3.5c-.879,0-1.602,.654-1.725,1.5h-.275c-1.517,0-2.75,1.233-2.75,2.75V14.25c0,1.517,1.233,2.75,2.75,2.75h7.5c1.517,0,2.75-1.233,2.75-2.75V4.75c0-1.517-1.233-2.75-2.75-2.75Zm-5.75,.25c0-.138,.112-.25,.25-.25h3.5c.138,0,.25,.112,.25,.25v1c0,.138-.112,.25-.25,.25h-3.5c-.138,0-.25-.112-.25-.25v-1Zm5.35,5.45l-3.75,5c-.136,.181-.346,.291-.572,.299-.009,0-.019,0-.028,0-.216,0-.422-.093-.564-.256l-1.75-2c-.273-.312-.241-.785,.071-1.058s.785-.242,1.058,.071l1.141,1.303,3.195-4.26c.249-.331,.719-.397,1.05-.15,.331,.249,.398,.719,.15,1.05Z"
                              className={`stroke-current ${
                                isCurrentPath("listing-approval-requests")
                                  ? "text-indigo-500"
                                  : "text-slate-600"
                              }`}
                            ></path>
                          </g>
                        </svg>

                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Listing Approve Requests
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              )}

              {/* Searched Words*/}
              {isAdmin && (
                <li
                  className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                    isCurrentPath("searched-words") && "bg-slate-900"
                  }`}
                >
                  <Link
                    href="/admin/searched-words"
                    className={`block text-slate-200 truncate transition duration-150 ${
                      isCurrentPath("searched-words")
                        ? "hover:text-slate-200"
                        : "hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon icon-tabler icon-tabler-clock-search"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="1"
                          stroke="#2c3e50"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path
                            d="M20.993 11.646a9 9 0 1 0 -9.318 9.348"
                            className={`stroke-current ${
                              isCurrentPath("searched-words")
                                ? "text-indigo-500"
                                : "text-slate-600"
                            }`}
                          />
                          <path
                            d="M12 7v5l1 1"
                            className={`stroke-current ${
                              isCurrentPath("searched-words")
                                ? "text-indigo-500"
                                : "text-slate-600"
                            }`}
                          />
                          <path
                            d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"
                            className={`stroke-current ${
                              isCurrentPath("searched-words")
                                ? "text-indigo-500"
                                : "text-slate-600"
                            }`}
                          />
                          <path
                            d="M20.2 20.2l1.8 1.8"
                            className={`stroke-current ${
                              isCurrentPath("searched-words")
                                ? "text-indigo-500"
                                : "text-slate-600"
                            }`}
                          />
                        </svg>

                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Users Search Story
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              )}

              {/*Settings*/}
              {isAdmin && (
                <li
                  className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                    isCurrentPath("settings") && "bg-slate-900"
                  }`}
                >
                  <Link
                    href="/admin/settings"
                    className={`block text-slate-200 truncate transition duration-150 ${
                      isCurrentPath("settings")
                        ? "hover:text-slate-200"
                        : "hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24"
                          width="24"
                          viewBox="0 0 20 20"
                        >
                          <g fill="none" className="nc-icon-wrapper">
                            <path
                              d="M16.25,8.25h-1.049c-.072-.597-.225-1.169-.453-1.702l.906-.523c.359-.207,.481-.666,.274-1.024-.207-.359-.666-.481-1.024-.274l-.913,.527c-.354-.471-.773-.889-1.243-1.243l.527-.914c.207-.359,.084-.817-.274-1.024-.358-.208-.817-.085-1.024,.274l-.523,.906c-.533-.229-1.105-.381-1.702-.453V1.75c0-.414-.336-.75-.75-.75s-.75,.336-.75,.75v1.049c-.597,.072-1.169,.225-1.702,.453l-.523-.906c-.208-.359-.667-.482-1.024-.274-.359,.207-.481,.666-.274,1.024l.527,.914c-.471,.354-.889,.772-1.243,1.243l-.913-.527c-.357-.207-.817-.085-1.024,.274-.207,.359-.084,.817,.274,1.024l.906,.523c-.228,.533-.381,1.105-.453,1.702H1.75c-.414,0-.75,.336-.75,.75s.336,.75,.75,.75h1.049c.072,.597,.225,1.169,.453,1.702l-.906,.523c-.359,.207-.481,.666-.274,1.024,.139,.241,.391,.375,.65,.375,.127,0,.256-.032,.375-.101l.913-.527c.354,.471,.773,.889,1.243,1.243l-.527,.914c-.207,.359-.084,.817,.274,1.024,.118,.068,.247,.101,.375,.101,.259,0,.511-.134,.65-.375l.523-.906c.533,.229,1.105,.381,1.702,.453v1.049c0,.414,.336,.75,.75,.75s.75-.336,.75-.75v-1.049c.597-.072,1.169-.225,1.702-.453l.523,.906c.139,.241,.391,.375,.65,.375,.127,0,.256-.032,.375-.101,.359-.207,.481-.666,.274-1.024l-.527-.914c.471-.354,.889-.772,1.243-1.243l.913,.527c.118,.068,.247,.101,.375,.101,.259,0,.511-.134,.65-.375,.207-.359,.084-.817-.274-1.024l-.906-.523c.228-.533,.381-1.105,.453-1.702h1.049c.414,0,.75-.336,.75-.75s-.336-.75-.75-.75Zm-7.25,5.5c-2.619,0-4.75-2.131-4.75-4.75s2.131-4.75,4.75-4.75,4.75,2.131,4.75,4.75-2.131,4.75-4.75,4.75Z"
                              className={`stroke-current ${
                                isCurrentPath("settings")
                                  ? "text-indigo-500"
                                  : "text-slate-600"
                              }`}
                            ></path>
                          </g>
                        </svg>

                        <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                          Settings
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="px-3 py-2">
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg
                className="w-6 h-6 fill-current sidebar-expanded:rotate-180"
                viewBox="0 0 24 24"
              >
                <path
                  className="text-slate-400"
                  d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z"
                />
                <path className="text-slate-600" d="M3 23H1V1h2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
