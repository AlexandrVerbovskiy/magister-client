import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React from "react";
import { isItemKeyDraggable } from "../../../utils";

const Content = React.forwardRef(function Content(
  { id, items, keyField, Component },
  ref
) {
  const { setNodeRef, over } = useDroppable({ id });
  let totalIsOver = over?.id === id;

  if (!totalIsOver && over?.id) {
    for (let i = 0; i < items.length; i++) {
      const checkableChild = items[i];

      if (
        checkableChild.id === over?.id &&
        !isItemKeyDraggable(checkableChild.key)
      ) {
        totalIsOver = true;
      }
    }
  }

  const setRefs = (node) => {
    setNodeRef(node);

    if (ref) {
      ref.current = node;
    }
  };

  return (
    <div
      ref={setRefs}
      className="w-3/4 border border-slate-200 px-3 py-2 text-sm leading-5 text-slate-800 shadow-sm h-full overflow-y-auto"
      style={{
        border: totalIsOver && "1px dashed blue",
      }}
      data-id={id}
    >
      <SortableContext
        id={id}
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item) => (
          <Component key={item[keyField]} item={item} />
        ))}
      </SortableContext>
    </div>
  );
});

export default Content;
