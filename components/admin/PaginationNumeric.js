import React from "react";
import { generatePagination } from "../../utils";

function PaginationNumeric({
  to,
  from,
  move,
  canNext,
  canPrev,
  page,
  countPages,
  totalCount,
  loading
}) {
  const visiblePages = generatePagination(page, countPages);

  const handleNextClick = () => {
    if (canNext) move(page + 1);
  };

  const handlePrevClick = () => {
    if (canPrev) move(page - 1);
  };

  const activeClass =
    "inline-flex items-center justify-center rounded leading-5 px-2.5 py-2 bg-white dark:bg-slate-800 hover:bg-teal-500 dark:hover:bg-teal-500 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-white shadow-sm";
  const inactiveClass =
    "inline-flex items-center justify-center rounded leading-5 px-2.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <nav
        className="flex justify-center mb-4 sm:mb-0 sm:order-1"
        role="navigation"
        aria-label="Navigation"
      >
        <div className="mr-2">
          <span
            className={canPrev ? activeClass : inactiveClass}
            onClick={handlePrevClick}
          >
            <span className="sr-only">Previous</span>
            <wbr />
            <svg className="h-4 w-4 fill-current" viewBox="0 0 16 16">
              <path d="M9.4 13.4l1.4-1.4-4-4 4-4-1.4-1.4L4 8z" />
            </svg>
          </span>
        </div>

        <ul className="inline-flex text-sm font-medium -space-x-px shadow-sm">
          {visiblePages.map((visiblePage, index) => {
            if (visiblePage == page)
              return (
                <li key={index}>
                  <span className="inline-flex items-center justify-center rounded-l leading-5 px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-teal-500">
                    {visiblePage}
                  </span>
                </li>
              );

            if (!visiblePage)
              return (
                <li key={index}>
                  <span className="inline-flex items-center justify-center leading-5 px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500">
                    …
                  </span>
                </li>
              );

            return (
              <li key={index}>
                <button
                  type="button"
                  className="inline-flex items-center justify-center leading-5 px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-teal-500 dark:hover:bg-teal-500 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-white"
                  onClick={() => move(visiblePage)}
                >
                  {visiblePage}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="ml-2">
          <span
            className={canNext ? activeClass : inactiveClass}
            onClick={handleNextClick}
          >
            <span className="sr-only">Next</span>
            <wbr />
            <svg className="h-4 w-4 fill-current" viewBox="0 0 16 16">
              <path d="M6.6 13.4L5.2 12l4-4-4-4 1.4-1.4L12 8z" />
            </svg>
          </span>
        </div>
      </nav>
      <div className="text-sm text-slate-500 dark:text-slate-400 text-center sm:text-left">
        Showing{" "}
        <span className="font-medium text-slate-600 dark:text-slate-300">
          {from}
        </span>{" "}
        to{" "}
        <span className="font-medium text-slate-600 dark:text-slate-300">
          {to}
        </span>{" "}
        of{" "}
        <span className="font-medium text-slate-600 dark:text-slate-300">
          {totalCount}
        </span>{" "}
        results
      </div>
    </div>
  );
}

export default PaginationNumeric;
