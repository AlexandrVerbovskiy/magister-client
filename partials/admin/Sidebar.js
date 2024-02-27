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
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <Link href="/" className="block">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <defs>
                <linearGradient
                  x1="28.538%"
                  y1="20.229%"
                  x2="100%"
                  y2="108.156%"
                  id="logo-a"
                >
                  <stop stopColor="#A5B4FC" stopOpacity="0" offset="0%" />
                  <stop stopColor="#A5B4FC" offset="100%" />
                </linearGradient>
                <linearGradient
                  x1="88.638%"
                  y1="29.267%"
                  x2="22.42%"
                  y2="100%"
                  id="logo-b"
                >
                  <stop stopColor="#38BDF8" stopOpacity="0" offset="0%" />
                  <stop stopColor="#38BDF8" offset="100%" />
                </linearGradient>
              </defs>
              <rect fill="#6366F1" width="32" height="32" rx="16" />
              <path
                d="M18.277.16C26.035 1.267 32 7.938 32 16c0 8.837-7.163 16-16 16a15.937 15.937 0 01-10.426-3.863L18.277.161z"
                fill="#4F46E5"
              />
              <path
                d="M7.404 2.503l18.339 26.19A15.93 15.93 0 0116 32C7.163 32 0 24.837 0 16 0 10.327 2.952 5.344 7.404 2.503z"
                fill="url(#logo-a)"
              />
              <path
                d="M2.223 24.14L29.777 7.86A15.926 15.926 0 0132 16c0 8.837-7.163 16-16 16-5.864 0-10.991-3.154-13.777-7.86z"
                fill="url(#logo-b)"
              />
            </svg>
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
                      <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path
                          className={`stroke-current ${
                            isCurrentPath()
                              ? "text-indigo-500"
                              : "text-slate-600"
                          }`}
                          fill="none"
                          d="M5 12l-2 0l9 -9l9 9l-2 0"
                          strokeWidth="2"
                        />
                        <path
                          className={`stroke-current ${
                            isCurrentPath()
                              ? "text-indigo-500"
                              : "text-slate-600"
                          }`}
                          fill="none"
                          strokeWidth="2"
                          d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"
                        />
                        <path
                          className={`stroke-current ${
                            isCurrentPath()
                              ? "text-indigo-500"
                              : "text-slate-600"
                          }`}
                          fill="none"
                          strokeWidth="2"
                          d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"
                        />
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
                      <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                        <path
                          className={`fill-current ${
                            isCurrentPath("users")
                              ? "text-indigo-500"
                              : "text-slate-600"
                          }`}
                          d="M18.974 8H22a2 2 0 012 2v6h-2v5a1 1 0 01-1 1h-2a1 1 0 01-1-1v-5h-2v-6a2 2 0 012-2h.974zM20 7a2 2 0 11-.001-3.999A2 2 0 0120 7zM2.974 8H6a2 2 0 012 2v6H6v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5H0v-6a2 2 0 012-2h.974zM4 7a2 2 0 11-.001-3.999A2 2 0 014 7z"
                        />
                        <path
                          className={`fill-current ${
                            isCurrentPath("users")
                              ? "text-indigo-300"
                              : "text-slate-400"
                          }`}
                          d="M12 6a3 3 0 110-6 3 3 0 010 6zm2 18h-4a1 1 0 01-1-1v-6H6v-6a3 3 0 013-3h6a3 3 0 013 3v6h-3v6a1 1 0 01-1 1z"
                        />
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
                      <svg className="shrink-0 h-6 w-6" viewBox="0 0 24 24">
                        <path
                          className={`fill-current ${
                            isCurrentPath("user-verify-requests/")
                              ? "text-indigo-500"
                              : "text-slate-600"
                          }`}
                          d="M8 1v2H3v19h18V3h-5V1h7v23H1V1z"
                        ></path>
                        <path
                          className={`fill-current ${
                            isCurrentPath("user-verify-requests/")
                              ? "text-indigo-500"
                              : "text-slate-600"
                          }`}
                          d="M1 1h22v23H1z"
                        ></path>
                        <path
                          className={`fill-current ${
                            isCurrentPath("user-verify-requests/")
                              ? "text-indigo-300"
                              : "text-slate-400"
                          }`}
                          d="M15 10.586L16.414 12 11 17.414 7.586 14 9 12.586l2 2zM5 0h14v4H5z"
                        ></path>
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
                <>
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
                            className="icon icon-tabler icon-tabler-device-sd-card"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#2c3e50"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                              marginLeft: "-5px",
                              marginRight: "-2px",
                            }}
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path
                              d="M7 21h10a2 2 0 0 0 2 -2v-14a2 2 0 0 0 -2 -2h-6.172a2 2 0 0 0 -1.414 .586l-3.828 3.828a2 2 0 0 0 -.586 1.414v10.172a2 2 0 0 0 2 2z"
                              className={`stroke-current ${
                                isCurrentPath("user-event-logs")
                                  ? "text-indigo-500"
                                  : "text-slate-600"
                              }`}
                            />
                            <path
                              d="M13 6v2"
                              className={`stroke-current ${
                                isCurrentPath("user-event-logs")
                                  ? "text-indigo-500"
                                  : "text-slate-600"
                              }`}
                            />
                            <path
                              d="M16 6v2"
                              className={`stroke-current ${
                                isCurrentPath("user-event-logs")
                                  ? "text-indigo-500"
                                  : "text-slate-600"
                              }`}
                            />
                            <path
                              d="M10 7v1"
                              className={`stroke-current ${
                                isCurrentPath("user-event-logs")
                                  ? "text-indigo-500"
                                  : "text-slate-600"
                              }`}
                            />
                          </svg>
                          <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                            User Logs
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>

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
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
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
                            className="icon icon-tabler icon-tabler-settings"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#2c3e50"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                              marginLeft: "-2px",
                              marginRight: "-5px",
                            }}
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path
                              className={`stroke-current ${
                                isCurrentPath("settings")
                                  ? "text-indigo-500"
                                  : "text-slate-600"
                              }`}
                              d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"
                            />
                            <path
                              className={`stroke-current ${
                                isCurrentPath("settings")
                                  ? "text-indigo-500"
                                  : "text-slate-600"
                              }`}
                              d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"
                            />
                          </svg>

                          <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                            Settings
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                </>
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
