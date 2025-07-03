import React, { useEffect, useRef, useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { cloneObject, generateRandomString } from "../../../utils";

const itemsParent1 = [
  { key: "1", body: "1" },
  { key: "2", body: "2" },
  { key: "3", body: "3" },
];

const Builder = () => {
  const parent2Ref = useRef(null);
  const [itemsParent2, setItemsParent2] = useState([]);

  const currentMouseRef = useRef(null);

  useEffect(() => {
    document.addEventListener(
      "mousemove",
      (e) => (currentMouseRef.current = e)
    );
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const isNew = active.data.current.type === "new";

    const parent2Rect = parent2Ref.current?.getBoundingClientRect();
    const mouseX = currentMouseRef.current.screenX;
    const mouseY = currentMouseRef.current.screenY;

    const overParent2 =
      parent2Rect &&
      (mouseY < parent2Rect.top - 20 ||
        mouseY > parent2Rect.bottom + 20 ||
        mouseX < parent2Rect.left - 20 ||
        mouseX > parent2Rect.right + 20);

    // Check if the dragged item is outside of the parent2 container
    if (overParent2) {
      if (!isNew) {
        // If over is null, the element has been dragged outside the droppable area
        setItemsParent2((prevItems) =>
          prevItems.filter((item) => item.id !== active.id)
        );
      }
    } else {
      if (isNew) {
        const itemDetails = itemsParent1.find((item) => item.key === active.id);

        setItemsParent2([
          ...itemsParent2,
          { ...cloneObject(itemDetails), id: generateRandomString() },
        ]);
      }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex space-x-4 w-full h-full h-max-full overflow-y-hidden">
        <div className="w-1/4 border border-slate-200 px-3 py-2 text-sm leading-5 text-slate-800 shadow-sm h-full overflow-y-auto overflow-x-none">
          {itemsParent1.map((item) => (
            <Draggable key={item.key} data={{ type: "new" }} id={item.key}>
              {item.body}
            </Draggable>
          ))}
        </div>

        <Droppable
          id="parent2"
          ref={parent2Ref}
          className="w-3/4 border border-slate-200 px-3 py-2 text-sm leading-5 text-slate-800 shadow-sm h-full overflow-y-auto"
        >
          {itemsParent2.map((item) => (
            <Draggable key={item.id} data={{ type: "old" }} id={item.id}>
              {item.body}
            </Draggable>
          ))}
        </Droppable>
      </div>
    </DndContext>
  );
};

const Draggable = ({ id, children, data = {} }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id, data });

  const [initialWidth, setInitialWidth] = useState(0);
  const nodeRef = useRef(null);

  useEffect(() => {
    if (nodeRef.current && !isDragging) {
      setInitialWidth(nodeRef.current.getBoundingClientRect().width);
    }
  }, [nodeRef.current?.getBoundingClientRect()?.width]);

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        nodeRef.current = node;
      }}
      {...listeners}
      {...attributes}
      className={`cursor-pointer p-2 mb-2 border border-slate-300 transition-all ${
        isDragging ? "opacity-50" : ""
      }`}
      style={{
        position: isDragging ? "absolute" : "relative",
        transform: isDragging
          ? `translate(${transform?.x || 0}px, ${transform?.y || 0}px)`
          : "none",
        transition: "opacity 0.1s ease",
        zIndex: isDragging ? 100 : 0,
        width: isDragging ? `${initialWidth}px` : "auto",
      }}
    >
      {children}
    </div>
  );
};

const Droppable = React.forwardRef(({ id, children, className = "" }, ref) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        ref.current = node;
      }}
      className={className}
    >
      {children}
    </div>
  );
});

export default Builder;
