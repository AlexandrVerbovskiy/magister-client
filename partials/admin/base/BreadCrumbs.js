import React from "react";

const BreadCrumbs = ({ links }) => {
  return (
    <div className="mb-4 sm:mb-0">
      <ul className="inline-flex flex-wrap text-sm font-medium">
        {links.map((link) => {
          return (
            <li
              key={link.href}
              className="after:content-['/'] last:after:hidden after:text-slate-400 dark:after:text-slate-600 after:px-2"
            >
              <a
                className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold hover:text-indigo-500 dark:hover:text-indigo-500"
                href={link.href}
              >
                {link.title}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BreadCrumbs;
