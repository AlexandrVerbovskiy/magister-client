import { useSortable } from "@dnd-kit/sortable";
import { useEffect, useRef, useState } from "react";

const DraggableItem = ({ children, item, example = false }) => {
  const { id, key } = item;
  const [initialWidth, setInitialWidth] = useState(0);

  const nodeRef = useRef(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id ?? key, data: { example } });

  useEffect(() => {
    if (nodeRef.current && !isDragging) {
      setInitialWidth(nodeRef.current.getBoundingClientRect().width);
    }
  }, [
    nodeRef.current?.getBoundingClientRect()?.width,
    nodeRef.current?.getBoundingClientRect()?.height,
  ]);

  let dopClassName = isDragging ? "opacity-0" : "";

  if (example) {
    dopClassName += " relative z-100";
  }

  const setRefs = (node) => {
    setNodeRef(node);
    nodeRef.current = node;
  };

  const handlePointerDown = (event) => {
    if (
      event.target.classList.contains("drag-ignore-section") ||
      event.target.closest(".drag-ignore-section")
    ) {
      event.stopPropagation();
      return;
    }

    listeners.onPointerDown?.(event);
  };

  return (
    <div
      ref={setRefs}
      {...listeners}
      {...attributes}
      onPointerDown={handlePointerDown}
      className={`cursor-pointer p-2 mb-2 border border-slate-300 ${dopClassName}`}
      style={{
        transform: transform
          ? `translate(${transform.x || 0}px, ${transform.y || 0}px)`
          : "none",
        transition,
        zIndex: isDragging ? 100 : "auto",
        width: isDragging ? `${initialWidth}px` : "100%",
      }}
      data-id={id ?? key}
    >
      {children}
    </div>
  );
};

export default DraggableItem;
