import { useDroppable } from "@dnd-kit/core";
import React from "react";

const Sidebar = React.forwardRef(function Sidebar(
  { id, items, keyField, Component, bodyField },
  ref
) {
  const { setNodeRef } = useDroppable({ id });

  const setSidebarRef = (node) => {
    setNodeRef(node);

    if (ref) {
      ref.current = node;
    }
  };

  return (
    <div
      ref={setSidebarRef}
      className="w-1/4 border border-slate-200 px-3 py-2 text-sm leading-5 text-slate-800 shadow-sm h-full overflow-y-auto overflow-x-hidden"
      data-id={id}
    >
      {items.map((item) => (
        <div className="relative" key={item[keyField]}>
          <div className="cursor-pointer p-2 mb-2 border border-slate-300 bg-white absolute top-0 left-0 w-full">
            {item[bodyField]}
          </div>

          <Component item={item} />
        </div>
      ))}
    </div>
  );
});

export default Sidebar;
