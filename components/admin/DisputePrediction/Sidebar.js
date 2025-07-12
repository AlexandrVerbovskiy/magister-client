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
      className="w-2/12 border border-slate-200 px-3 py-2 text-sm leading-5 text-slate-800 shadow-sm h-full overflow-y-auto overflow-x-hidden"
      data-id={id}
    >
      {items.map((item, itemIndex) => (
        <>
          <div className={`mb-2${itemIndex === 0 ? "" : " mt-2"}`}>
            <b>{item.label}</b>
          </div>
          {item.list.map((operation) => (
            <div className="relative" key={operation[keyField]}>
              <div className="cursor-pointer p-2 mb-2 border border-slate-300 bg-white absolute top-0 left-0 w-full">
                {operation[bodyField]}
              </div>

              <Component item={operation} />
            </div>
          ))}
        </>
      ))}
    </div>
  );
});

export default Sidebar;
