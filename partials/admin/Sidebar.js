import React, { useState, useEffect, useRef, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { IndiceContext } from "../../contexts";
import SidebarTypicalLink from "./SidebarTypicalLink";
import SidebarGroupedLinks from "./SidebarGroupedLinks";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const sidebar = useRef(null);
  const { isAdmin, isSupport } = useContext(IndiceContext);

  const [currentPath, setCurrentPath] = useState("");
  const router = useRouter();

  useEffect(() => {
    setCurrentPath(router.asPath);
  }, [router]);

  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
    setSidebarExpanded(
      storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
    );
  }, []);

  // close on click outside
  useEffect(() => {
    if (sidebarOpen) {
      const clickHandler = ({ target }) => {
        if (!sidebar.current || !sidebarOpen || sidebar.current.contains(target)) {
          return;
        }

        setSidebarOpen(false);
      };
      document.addEventListener("click", clickHandler);
      return () => document.removeEventListener("click", clickHandler);
    }
  }, [sidebarOpen]);

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
        className={`fixed inset-0 bg-teal-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-teal-800 p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 mt-1 pr-3 sm:px-2">
          {/* Close button */}
          <Link
            href="/"
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
          </Link>
          {/* Logo */}
          <Link href="/" className="hidden lg:block w-full">
            <div className="adaptive-logo-image" />
          </Link>
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            <h3 className="text-xs uppercase text-slate-50 font-semibold pl-3">
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
            <ul className="mt-3 p-0">
              {/* Main */}
              <SidebarTypicalLink
                title="Main"
                SVG={({ current }) => (
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
                          current ? "text-teal-500" : "text-slate-50"
                        }`}
                      ></path>
                    </g>
                  </svg>
                )}
              />

              <SidebarGroupedLinks
                setSidebarExpanded={setSidebarExpanded}
                title="Users"
                sublinks={[
                  { href: "users", title: "List" },
                  { href: "user-verify-requests", title: "Verify Requests" },
                ]}
                SVG={({ current }) => (
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
                          current ? "text-teal-500" : "text-slate-50"
                        }`}
                      ></circle>
                      <circle
                        cx="12"
                        cy="3.75"
                        r="2.75"
                        className={`stroke-current ${
                          current ? "text-teal-500" : "text-slate-50"
                        }`}
                      ></circle>
                      <path
                        d="M17.196,11.098c-.811-2.152-2.899-3.598-5.196-3.598-1.417,0-2.752,.553-3.759,1.48,1.854,.709,3.385,2.169,4.109,4.089,.112,.296,.162,.603,.182,.91,1.211-.05,2.409-.26,3.565-.646,.456-.152,.834-.487,1.041-.919,.2-.42,.221-.888,.059-1.316Z"
                        className={`stroke-current ${
                          current ? "text-teal-500" : "text-slate-50"
                        }`}
                      ></path>
                      <path
                        d="M10.946,13.598c-.811-2.152-2.899-3.598-5.196-3.598S1.365,11.446,.554,13.598c-.162,.429-.141,.896,.059,1.316,.206,.432,.585,.767,1.041,.919,1.325,.442,2.704,.667,4.096,.667s2.771-.225,4.096-.667c.456-.152,.834-.487,1.041-.919,.2-.42,.221-.888,.059-1.316Z"
                        className={`stroke-current ${
                          current ? "text-teal-500" : "text-slate-50"
                        }`}
                      ></path>
                    </g>
                  </svg>
                )}
              />

              <SidebarGroupedLinks
                setSidebarExpanded={setSidebarExpanded}
                title="Reviews"
                sublinks={[
                  { href: "owner-reviews", title: "Owner Reviews" },
                  { href: "renter-reviews", title: "Renter Reviews" },
                ]}
                SVG={({ current }) => (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-message"
                    height="24"
                    width="24"
                    viewBox="0 0 22 22"
                    strokeWidth="1.5"
                    stroke="#2c3e50"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path
                      d="M8 9h8"
                      className={`stroke-current ${
                        current ? "text-teal-500" : "text-slate-50"
                      }`}
                    />
                    <path
                      d="M8 13h6"
                      className={`stroke-current ${
                        current ? "text-teal-500" : "text-slate-50"
                      }`}
                    />
                    <path
                      d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z"
                      className={`stroke-current ${
                        current ? "text-teal-500" : "text-slate-50"
                      }`}
                    />
                  </svg>
                )}
              />

              {isAdmin && (
                <SidebarGroupedLinks
                  setSidebarExpanded={setSidebarExpanded}
                  title="Listings"
                  sublinks={[
                    { href: "listings", title: "List" },
                    {
                      href: "listing-approval-requests",
                      title: "Approval Requests",
                    },
                    { href: "listing-categories", title: "Categories" },
                    {
                      href: "others-listing-categories",
                      title: "Others Categories",
                    },
                  ]}
                  SVG={({ current }) => (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24"
                      width="24"
                      viewBox="0 0 20 20"
                    >
                      <g fill="none" className="nc-icon-wrapper">
                        <path
                          className={`stroke-current ${
                            current ? "text-teal-500" : "text-slate-50"
                          }`}
                          d="M15.685,4.423L9.816,1.333c-.511-.271-1.121-.27-1.631,0L2.315,4.423c-.494,.26-.801,.769-.801,1.327s.307,1.067,.801,1.327l5.869,3.09c.255,.135,.536,.203,.816,.203s.56-.067,.815-.202l5.87-3.091c.494-.26,.801-.769,.801-1.327s-.307-1.067-.801-1.327Z"
                        ></path>
                        <path
                          className={`stroke-current ${
                            current ? "text-teal-500" : "text-slate-50"
                          }`}
                          d="M15.736,8.25c-.414,0-.75,.336-.75,.75l-5.87,3.091c-.072,.038-.158,.038-.232,0l-5.87-3.091c0-.414-.336-.75-.75-.75s-.75,.336-.75,.75c0,.559,.307,1.067,.801,1.327l5.869,3.09c.255,.135,.536,.203,.816,.203s.56-.067,.815-.202l5.87-3.091c.494-.26,.801-.769,.801-1.327,0-.414-.336-.75-.75-.75Z"
                          data-color="color-2"
                        ></path>
                        <path
                          className={`stroke-current ${
                            current ? "text-teal-500" : "text-slate-50"
                          }`}
                          d="M15.736,11.5c-.414,0-.75,.336-.75,.75l-5.87,3.091c-.072,.038-.158,.038-.232,0l-5.87-3.091c0-.414-.336-.75-.75-.75s-.75,.336-.75,.75c0,.559,.307,1.067,.801,1.327l5.869,3.09c.255,.135,.536,.203,.816,.203s.56-.067,.815-.202l5.87-3.091c.494-.26,.801-.769,.801-1.327,0-.414-.336-.75-.75-.75Z"
                          data-color="color-2"
                        ></path>
                      </g>
                    </svg>
                  )}
                />
              )}

              <SidebarTypicalLink
                title="Rentals"
                link="orders"
                SVG={({ current }) => (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      className={`stroke-current ${
                        current ? "text-teal-500" : "text-slate-50"
                      }`}
                      d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518z"
                      strokeWidth="0.3"
                    />
                    <path
                      className={`stroke-current ${
                        current ? "text-teal-500" : "text-slate-50"
                      }`}
                      d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"
                      strokeWidth="0.3"
                    />
                    <path
                      className={`stroke-current ${
                        current ? "text-teal-500" : "text-slate-50"
                      }`}
                      d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11m0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12"
                      strokeWidth="0.3"
                    />
                  </svg>
                )}
              />

              <SidebarTypicalLink
                title="Disputes"
                link="disputes"
                SVG={({ current }) => (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-scale"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#2c3e50"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      className={`stroke-current ${
                        current ? "text-teal-500" : "text-slate-50"
                      }`}
                      d="M7 20l10 0"
                    />
                    <path
                      className={`stroke-current ${
                        current ? "text-teal-500" : "text-slate-50"
                      }`}
                      d="M6 6l6 -1l6 1"
                    />
                    <path
                      className={`stroke-current ${
                        current ? "text-teal-500" : "text-slate-50"
                      }`}
                      d="M12 3l0 17"
                    />
                    <path
                      className={`stroke-current ${
                        current ? "text-teal-500" : "text-slate-50"
                      }`}
                      d="M9 12l-3 -6l-3 6a3 3 0 0 0 6 0"
                    />
                    <path
                      className={`stroke-current ${
                        current ? "text-teal-500" : "text-slate-50"
                      }`}
                      d="M21 12l-3 -6l-3 6a3 3 0 0 0 6 0"
                    />
                  </svg>
                )}
              />

              <SidebarTypicalLink
                title="Chat"
                link="chats"
                SVG={({ current }) => (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-brand-messenger"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#2c3e50"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path
                      className={`stroke-current ${
                        current ? "text-teal-500" : "text-slate-50"
                      }`}
                      d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1"
                    />
                    <path
                      className={`stroke-current ${
                        current ? "text-teal-500" : "text-slate-50"
                      }`}
                      d="M8 13l3 -2l2 2l3 -2"
                    />
                  </svg>
                )}
              />

              {isAdmin && (
                <SidebarGroupedLinks
                  setSidebarExpanded={setSidebarExpanded}
                  title="Payments"
                  sublinks={[
                    { href: "payments/senders", title: "Sender Payments" },
                    {
                      href: "payments/recipients",
                      title: "Recipient Payments",
                    },
                  ]}
                  SVG={({ current }) => (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      width="20"
                      viewBox="0 0 20 20"
                      strokeWidth="1.5"
                      className={`stroke-current ${
                        current ? "text-teal-500" : "text-slate-50"
                      }`}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path
                        className={`stroke-current ${
                          current ? "text-teal-500" : "text-slate-50"
                        }`}
                        d="M10 13l2.5 0c2.5 0 5 -2.5 5 -5c0 -3 -1.9 -5 -5 -5h-5.5c-.5 0 -1 .5 -1 1l-2 14c0 .5 .5 1 1 1h2.8l1.2 -5c.1 -.6 .4 -1 1 -1zm7.5 -5.8c1.7 1 2.5 2.8 2.5 4.8c0 2.5 -2.5 4.5 -5 4.5h-2.6l-.6 3.6a1 1 0 0 1 -1 .8l-2.7 0a.5 .5 0 0 1 -.5 -.6l.2 -1.4"
                      />
                    </svg>
                  )}
                />
              )}

              {isAdmin && (
                <SidebarTypicalLink
                  title="Search Story"
                  link="searched-words"
                  SVG={({ current }) => (
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
                          current ? "text-teal-500" : "text-slate-50"
                        }`}
                      />
                      <path
                        d="M12 7v5l1 1"
                        className={`stroke-current ${
                          current ? "text-teal-500" : "text-slate-50"
                        }`}
                      />
                      <path
                        d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"
                        className={`stroke-current ${
                          current ? "text-teal-500" : "text-slate-50"
                        }`}
                      />
                      <path
                        d="M20.2 20.2l1.8 1.8"
                        className={`stroke-current ${
                          current ? "text-teal-500" : "text-slate-50"
                        }`}
                      />
                    </svg>
                  )}
                />
              )}

              {isAdmin && (
                <SidebarTypicalLink
                  title="User Logs"
                  link="user-event-logs"
                  SVG={({ current }) => (
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
                            current ? "text-teal-500" : "text-slate-50"
                          }`}
                        ></path>
                      </g>
                    </svg>
                  )}
                />
              )}

              {isAdmin && (
                <SidebarTypicalLink
                  title="Settings"
                  link="settings"
                  SVG={({ current }) => (
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
                            current ? "text-teal-500" : "text-slate-50"
                          }`}
                        ></path>
                      </g>
                    </svg>
                  )}
                />
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
                  className="text-slate-100"
                  d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z"
                />
                <path className="text-slate-50" d="M3 23H1V1h2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
