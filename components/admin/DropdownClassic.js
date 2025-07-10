import React, { useState, useRef, useEffect } from "react";
import Transition from "../../utils/transition";
import DropdownClassicOptionWrapper from "./DropdownClassicOptionWrapper";
import STATIC from "../../static";

function DropdownClassic({
  options,
  selected,
  setSelected,
  needSearch = true,
  disabledText = null,
  dropdownDisabled = false,
  popupBindClassName = "top-full",
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const trigger = useRef(null);
  const dropdown = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const filteredOptions = options.filter((option) =>
    option.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedElem = options.find((option) => option.value === selected);

  const selectedTitle = selectedElem
    ? selectedElem.title
    : options.find((option) => option.default)?.title;

  return (
    <div className="dropdown-classic relative inline-flex w-full">
      <button
        ref={trigger}
        className="w-full btn justify-between min-w-44 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-500 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-200"
        aria-label="Select date range"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
        disabled={dropdownDisabled}
      >
        <span className="flex items-center">
          <span>{selectedTitle}</span>
        </span>
        <svg
          className="shrink-0 ml-1 fill-current text-slate-400"
          width="11"
          height="7"
          viewBox="0 0 11 7"
        >
          <path d="M5.4 6.8L0 1.4 1.4 0l4 4 4-4 1.4 1.4z" />
        </svg>
      </button>
      <Transition
        show={dropdownOpen}
        tag="div"
        className={`z-10 absolute ${popupBindClassName} left-0 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pt-1.5 rounded shadow-lg overflow-hidden mt-1`}
        enter="transition ease-out duration-100 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          className="font-medium text-sm text-slate-600 dark:text-slate-300"
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          {needSearch && (
            <input
              name="selectFilter"
              type="text"
              className="form-input w-full border-0 border-b border-slate-200 dark:border-slate-700 rounded-sm px-3 py-1 focus:border-teal-500 focus:ring-teal-500"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              maxLength={STATIC.LIMITS.SEARCH_INPUT_LENGTH}
            />
          )}

          <div className="select-options-list">
            {filteredOptions.map((option) => {
              const disabled = option["active"] === false;

              return (
                <DropdownClassicOptionWrapper
                  tooltipText={disabledText}
                  disabled={disabled}
                  key={option.key ?? option.value}
                >
                  <button
                    tabIndex="0"
                    className={`select-option flex items-center w-full hover:bg-slate-50 hover:dark:bg-slate-700/20 py-1 px-3 ${
                      disabled ? "cursor-auto " : "cursor-pointer "
                    }${option.value === selected && "text-teal-500"}`}
                    onClick={() => {
                      if (disabled) return;
                      setDropdownOpen(false);
                      setSelected(option.value);
                    }}
                  >
                    <svg
                      className={`shrink-0 mr-2 fill-current text-teal-500 ${
                        option.value !== selected && "invisible"
                      }`}
                      width="12"
                      height="9"
                      viewBox="0 0 12 9"
                    >
                      <path d="M10.28.28L3.989 6.575 1.695 4.28A1 1 0 00.28 5.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28.28z" />
                    </svg>
                    <span className={disabled ? "text-gray-200" : ""}>
                      {option.title}
                    </span>
                  </button>
                </DropdownClassicOptionWrapper>
              );
            })}
          </div>
        </div>
      </Transition>
    </div>
  );
}

export default DropdownClassic;
