import React, { useState, useRef, useEffect } from "react";

function DropdownFilter({ align, children }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="dropdown dropdown-filter">
      <button
        ref={trigger}
        className="btn bg-white text-secondary filter-trigger"
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen ? "true" : "false"}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
          <path d="M9 15H7a1 1 0 010-2h2a1 1 0 010 2zM11 11H5a1 1 0 010-2h6a1 1 0 010 2zM13 7H3a1 1 0 010-2h10a1 1 0 010 2zM15 3H1a1 1 0 010-2h14a1 1 0 010 2z" />
        </svg>
      </button>

      <div
        ref={dropdown}
        className={`dropdown-menu${dropdownOpen ? " show" : ""} ${
          align === "right" ? "dropdown-menu-end" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default DropdownFilter;
