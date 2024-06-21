import { useEffect, useRef } from "react";

const DropdownMenu = ({ children, activePopup, closePopup, style = {} }) => {
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      closePopup();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`dropdown-menu ${activePopup ? "show" : ""}`}
      tabIndex={0}
      style={{ ...style }}
    >
      {activePopup && children}
    </div>
  );
};

export default DropdownMenu;
