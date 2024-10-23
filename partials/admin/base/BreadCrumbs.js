import React from "react";

const BreadCrumbs = ({ links }) => {
  return (
    <div className="mb-4 sm:mb-0">
      <ul className="max-w-full inline-flex flex-wrap text-sm font-medium">
        {links.map((link, index) => {
          return (
            <li
              key={index}
              className="overflow-separate max-w-full text-2xl md:text-3xl after:content-['/'] last:after:hidden after:text-slate-400 dark:after:text-slate-600 after:px-2"
            >
              {link.href && (
                <a
                  className="text-slate-800 dark:text-slate-100 font-bold hover:text-teal-500 dark:hover:text-teal-500"
                  href={link.href}
                >
                  {link.title}
                </a>
              )}

              {!link.href && (
                <div
                  style={{ transition: "0.5s" }}
                  className="max-w-full overflow-separate cursor-pointer text-slate-800 dark:text-slate-100 font-bold hover:text-teal-500 dark:hover:text-teal-500"
                >
                  {link.title}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BreadCrumbs;
