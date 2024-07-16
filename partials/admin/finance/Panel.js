import React, { useEffect, useRef } from "react";
import { fullDateConverter, getFilenameByPath } from "../../../utils";

function TransactionPanel({ panelItem, handlePanelItemClear }) {
  const closeBtn = useRef(null);
  const panelContent = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (
        !panelItem ||
        panelContent.current.contains(target) ||
        closeBtn.current.contains(target)
      )
        return;
      handlePanelItemClear();
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!panelItem || keyCode !== 27) return;
      handlePanelItemClear();
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div
      ref={panelContent}
      className={`absolute inset-0 sm:left-auto z-20 shadow-xl transition-transform duration-200 ease-in-out ${
        panelItem ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="sticky top-16 bg-slate-50 dark:bg-gradient-to-b dark:from-slate-800 dark:to-slate-900 overflow-x-hidden overflow-y-auto no-scrollbar shrink-0 border-l border-slate-200 dark:border-slate-700 w-full sm:w-[390px] h-[calc(100dvh-64px)]">
        <button
          ref={closeBtn}
          onClick={handlePanelItemClear}
          className="absolute top-0 right-0 mt-6 mr-6 group p-2"
        >
          <svg
            className="w-4 h-4 fill-slate-400 group-hover:fill-slate-600 pointer-events-none"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m7.95 6.536 4.242-4.243a1 1 0 1 1 1.415 1.414L9.364 7.95l4.243 4.242a1 1 0 1 1-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 0 1-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 0 1 1.414-1.414L7.95 6.536Z" />
          </svg>
        </button>
        <div className="py-8 px-4 lg:px-8">
          <div className="max-w-sm mx-auto lg:max-w-none">
            <div className="text-slate-800 dark:text-slate-100 font-semibold text-center mb-1">
              Log Info
            </div>
            <div className="text-sm text-center italic">
              {panelItem && fullDateConverter(panelItem.createdAt)}
            </div>
            {/* Details */}
            <div className="drop-shadow-lg mt-12">
              {/* Top */}
              <div className="bg-white dark:bg-slate-700 rounded-t-xl px-5 pb-2.5 text-center">
                <div className="text-sm font-medium text-slate-800 dark:text-slate-100 mb-3">
                  {panelItem && panelItem.message}
                </div>

                {panelItem && panelItem.success && (
                  <div className="text-xs inline-flex font-medium bg-emerald-100 text-emerald-500 rounded-full text-center px-2.5 py-1">
                    Success
                  </div>
                )}

                {panelItem && !panelItem.success && (
                  <div className="text-xs inline-flex font-medium bg-rose-100 text-rose-500 rounded-full text-center px-2.5 py-1">
                    Failed
                  </div>
                )}
              </div>
              {/* Divider */}
              <div
                className="flex justify-between items-center"
                aria-hidden="true"
              >
                <svg
                  className="w-5 h-5 fill-white dark:fill-slate-700"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 20c5.523 0 10-4.477 10-10S5.523 0 0 0h20v20H0Z" />
                </svg>
                <div className="grow w-full h-5 bg-white dark:bg-slate-700 flex flex-col justify-center">
                  <div className="h-px w-full border-t border-dashed border-slate-200 dark:border-slate-600" />
                </div>
                <svg
                  className="w-5 h-5 fill-white dark:fill-slate-700 rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 20c5.523 0 10-4.477 10-10S5.523 0 0 0h20v20H0Z" />
                </svg>
              </div>
              {/* Bottom */}
              <div className="bg-white dark:bg-slate-800 dark:bg-gradient-to-b dark:from-slate-700 dark:to-slate-700/70 rounded-b-xl p-5 pt-2.5 text-sm space-y-3">
                <div className="flex justify-between space-x-1">
                  <span className="italic">ID:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-100 text-right">
                    {panelItem && panelItem.id}
                  </span>
                </div>
                <div className="flex justify-between space-x-1">
                  <span className="italic">File:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-100 text-right">
                    {panelItem && getFilenameByPath(panelItem.file)}
                  </span>
                </div>
                <div className="flex justify-between space-x-1">
                  <span className="italic">Line:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-100 text-right">
                    {panelItem && panelItem.line}
                  </span>
                </div>
                <div className="flex justify-between space-x-1">
                  <span className="italic">Symbol:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-100 text-right">
                    {panelItem && panelItem.symbol}
                  </span>
                </div>
                <div className="flex justify-between space-x-1">
                  <span className="italic">Created at:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-100 text-right">
                    {panelItem && fullDateConverter(panelItem.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            {/* Receipts */}
            <div className="drop-shadow-lg mt-6">
              <div className="bg-white dark:bg-slate-700 rounded-t-xl px-5 pt-2.5 text-center">
                <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  Log Body
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 dark:bg-gradient-to-b dark:from-slate-700 dark:to-slate-700/70 rounded-b-xl p-5 pt-2.5 text-sm space-y-3">
                <div style={{ wordWrap: "break-word" }}>
                  {panelItem && panelItem.body}
                </div>
              </div>
            </div>

            <div className="drop-shadow-lg mt-6">
              <div className="bg-white dark:bg-slate-700 rounded-t-xl px-5 pt-2.5 text-center">
                <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  Log Message
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 dark:bg-gradient-to-b dark:from-slate-700 dark:to-slate-700/70 rounded-b-xl p-5 pt-2.5 text-sm space-y-3">
                <div style={{ wordWrap: "break-word" }}>
                  {panelItem && panelItem.message}
                </div>
              </div>
            </div>

            <div className="drop-shadow-lg mt-6">
              <div className="bg-white dark:bg-slate-700 rounded-t-xl px-5 pt-2.5 text-center">
                <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  File Path
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 dark:bg-gradient-to-b dark:from-slate-700 dark:to-slate-700/70 rounded-b-xl p-5 pt-2.5 text-sm space-y-3">
                <div style={{ wordWrap: "break-word" }}>
                  {panelItem && panelItem.file}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionPanel;
