import React, { useState, useEffect } from "react";

function SidebarLinkGroup({ children, activecondition }) {
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(activecondition), [activecondition]);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <li
      className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
        activecondition ? "bg-teal-900" : ""
      }`}
    >
      {children(handleClick, open)}
    </li>
  );
}

export default SidebarLinkGroup;
