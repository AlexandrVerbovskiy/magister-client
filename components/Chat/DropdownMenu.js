import { useEffect, useRef } from "react";

const DropdownMenu = ({ activePopup, closePopup }) => {
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
    >
      <button className="dropdown-item d-flex align-items-center">
        <i className="bx bx-pin"></i> Pin to Top
      </button>
      <button className="dropdown-item d-flex align-items-center">
        <i className="bx bx-trash"></i> Delete Chat
      </button>
      <button className="dropdown-item d-flex align-items-center">
        <i className="bx bx-block"></i> Block
      </button>
    </div>
  );
};

export default DropdownMenu;
