import React, { useState, useRef, useEffect, useContext } from "react";
import Transition from "../../utils/transition";
import { IndiceContext } from "../../contexts";
import DropdownClassicOptionWrapper from "./DropdownClassicOptionWrapper";
import STATIC from "../../static";

function DropdownClassicAjax({
  fetchOptions,
  selected,
  onChange,
  selectedTitle,
  disabledText = null,
  placeholder = null,
}) {
  const { error } = useContext(IndiceContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  useEffect(() => {
    loadOptions();
  }, [page]);

  useEffect(() => {
    if (dropdownOpen) {
      setLoading(false);
    }
  }, [dropdownOpen]);

  useEffect(() => {
    if (dropdownOpen) {
      trigger.current.focus();
    }
  }, [dropdownOpen]);

  const loadOptions = async ({
    actualLoading = null,
    actualHasMore = null,
    actualOptions = null,
    actualPage = null,
    actualSearchTerm = null,
  } = {}) => {
    if (actualLoading !== null) {
      setLoading(actualLoading);
    } else {
      actualLoading = loading;
    }

    if (actualHasMore !== null) {
      setHasMore(actualHasMore);
    } else {
      actualHasMore = hasMore;
    }

    if (actualOptions !== null) {
      setOptions(actualOptions);
    } else {
      actualOptions = options;
    }

    if (actualPage !== null) {
      setPage(actualPage);
    } else {
      actualPage = page;
    }

    if (actualSearchTerm !== null) {
      setSearchTerm(actualSearchTerm);
    } else {
      actualSearchTerm = searchTerm;
    }

    if (actualLoading || !actualHasMore) return;
    setLoading(true);

    try {
      const newOptions = await fetchOptions(actualPage, actualSearchTerm);

      if (newOptions.length === 0) {
        setHasMore(false);
      } else {
        setOptions([...actualOptions, ...newOptions]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (e) {
      error.set(e.message);
    }

    setLoading(false);
  };

  const selectedElem = options.find((option) => option.value === selected);
  let selectedTitleToView = selectedElem
    ? selectedElem.title
    : options.find((option) => option.default)?.title;

  if (!selectedTitleToView) {
    selectedTitleToView = selectedTitle;
  }

  useEffect(() => {
    loadOptions();
  }, []);

  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.target;
    if (scrollHeight - scrollTop === clientHeight) {
      loadOptions();
    }
  };

  const handleChangeSearchTerm = (value) => {
    loadOptions({
      actualHasMore: true,
      actualLoading: false,
      actualOptions: [],
      actualPage: 1,
      actualSearchTerm: value,
    });
  };

  return (
    <div className="relative inline-flex w-full" onScroll={handleScroll}>
      <button
        ref={trigger}
        className="w-full btn justify-between min-w-44 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-500 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-200"
        aria-label="Select date range"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
        style={{ minHeight: "37.6px" }}
      >
        <span className="block text-start w-full overflow-separate">
          {selectedTitleToView ? (
            <span>{selectedTitleToView}</span>
          ) : (
            <span className="text-slate-400">{placeholder}</span>
          )}
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
        className="z-10 absolute top-full left-0 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pt-1.5 rounded shadow-lg overflow-hidden mt-1"
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
          <input
            name="selectFilter"
            type="text"
            className="form-input w-full border-0 border-b border-slate-200 dark:border-slate-700 rounded-sm px-3 py-1 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => handleChangeSearchTerm(e.target.value)}
            maxLength={STATIC.LIMITS.SEARCH_INPUT_LENGTH}
          />

          <div className="select-options-list">
            {options.map((option) => {
              const disabled = option["active"] === false;

              return (
                <DropdownClassicOptionWrapper
                  tooltipText={disabledText}
                  disabled={disabled}
                  key={option.value}
                >
                  <button
                    tabIndex="0"
                    className={`select-option flex items-center w-full hover:bg-slate-50 hover:dark:bg-slate-700/20 py-1 px-3 ${
                      disabled ? "cursor-auto " : "cursor-pointer "
                    }${option.value === selected && "text-indigo-500"}`}
                    onClick={(e) => {
                      if (disabled) return;
                      onChange(option.value, option.title);
                      setDropdownOpen(false);
                    }}
                  >
                    <svg
                      className={`shrink-0 mr-2 fill-current text-indigo-500 ${
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

          {loading && <div>Loading...</div>}
          {options.length < 1 && !hasMore && !loading && (
            <div style={{ padding: "5px 12px" }}>No options</div>
          )}
        </div>
      </Transition>
    </div>
  );
}

export default DropdownClassicAjax;
