import { useEffect, useRef } from "react";

const DropdownMenu = ({
  children,
  activePopup,
  closePopup,
  style = {},
  className = "dropdown-menu",
}) => {
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
      className={`${className} ${activePopup ? "show" : ""}`}
      tabIndex={0}
      style={{ ...style }}
    >
      {activePopup && children}
    </div>
  );
};

export default DropdownMenu;
