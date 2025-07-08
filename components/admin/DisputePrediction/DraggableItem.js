import { useSortable } from "@dnd-kit/sortable";
import { useEffect, useRef, useState } from "react";

const DraggableItem = ({ item, example = false }) => {
  const { id, type, body } = item;
  const [initialWidth, setInitialWidth] = useState(0);

  const nodeRef = useRef(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id ?? type, data: { example } });

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

  return (
    <div
      ref={setRefs}
      {...listeners}
      {...attributes}
      className={`cursor-pointer p-2 mb-2 border border-slate-300 ${dopClassName}`}
      style={{
        transform: transform
          ? `translate(${transform.x || 0}px, ${transform.y || 0}px)`
          : "none",
        transition,
        zIndex: isDragging ? 100 : "auto",
        width: isDragging ? `${initialWidth}px` : "100%",
      }}
      data-id={id ?? type}
    >
      {body}
    </div>
  );
};

export default DraggableItem;
