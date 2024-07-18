import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { isCurrentAdminPath } from "../../services/isCurrentPath";
import SidebarLinkGroup from "./SidebarLinkGroup";

const SidebarGroupedLinks = ({
  setSidebarExpanded,
  title,
  sublinks = [],
  SVG,
}) => {
  const router = useRouter();
  const [isCurrent, setIsCurrent] = useState(false);
  const [bodyMaxHeight, setBodyMaxHeight] = useState(0);
  const ulRef = useRef(null);

  useEffect(() => {
    setIsCurrent(false);

    sublinks.forEach((sublink) => {
      if (isCurrentAdminPath(router.asPath, sublink.href)) {
        setIsCurrent(true);
      }
    });
  }, [router.asPath]);

  useEffect(() => {
    const styles = window.getComputedStyle(ulRef.current);
    const margin =
      parseFloat(styles["marginTop"]) + parseFloat(styles["marginBottom"]);

    const height = Math.ceil(ulRef.current.offsetHeight + margin);
    setBodyMaxHeight(height);
  }, [ulRef.current]);

  return (
    <SidebarLinkGroup activecondition={isCurrent}>
      {(handleClick, open) => {
        return (
          <React.Fragment>
            <a
              href="#0"
              className={`sidebar-group-header block text-slate-200 truncate transition duration-150 ${
                isCurrent ? "hover:text-slate-200" : "hover:text-white"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleClick();
                setSidebarExpanded(true);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <SVG current={isCurrent} />

                  <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                    {title}
                  </span>
                </div>

                <div className="flex shrink-0 ml-2">
                  <svg
                    className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                      open && "rotate-180"
                    }`}
                    viewBox="0 0 12 12"
                  >
                    <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                  </svg>
                </div>
              </div>
            </a>
            <div
              style={{ maxHeight: bodyMaxHeight }}
              className="sidebar-group-body lg:hidden lg:sidebar-expanded:block 2xl:block"
            >
              <ul ref={ulRef} className={`pl-9 mt-1 ${open ? "shown" : ""}`}>
                {sublinks.map((sublink) => (
                  <li className="mb-1 last:mb-0" key={sublink.href}>
                    <Link
                      href={"/admin/" + sublink.href + "/"}
                      className={
                        "block transition duration-150 truncate " +
                        (isCurrentAdminPath(router.asPath, sublink.href)
                          ? "text-indigo-500"
                          : "text-slate-400 hover:text-slate-200")
                      }
                    >
                      <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                        {sublink.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </React.Fragment>
        );
      }}
    </SidebarLinkGroup>
  );
};

export default SidebarGroupedLinks;
