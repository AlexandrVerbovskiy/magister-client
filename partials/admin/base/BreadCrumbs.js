import React from "react";

const BreadCrumbs = ({ links }) => {
  return (
    <ul className="inline-flex flex-wrap text-sm font-medium">
      {links.map((link) => {
        return (
          <li
            key={link.href}
            className="after:content-['/'] last:after:hidden after:text-slate-400 dark:after:text-slate-600 after:px-2"
          >
            <a
              className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-500"
              href={link.href}
            >
              {link.title}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default BreadCrumbs;
