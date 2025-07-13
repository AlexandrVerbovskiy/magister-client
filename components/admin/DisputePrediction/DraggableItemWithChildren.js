import React, { useEffect, useRef, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ContentItem from "./ContentItem";

const DraggableItemWithChildren = ({
  item,
  activeDrag,
  getDroppableParent,
  setItems,
  tableStructure,
  setActiveTableDetails,
}) => {
  const { id, body, subItems = [] } = item;
  const [initialWidth, setInitialWidth] = useState(0);
  const nodeRef = useRef(null);

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
    transform,
    transition,
    over,
    isSorting,
    isOver,
  } = useSortable({ id });

  const { setNodeRef: setDropRef } = useDroppable({
    id,
  });

  const totalIsOver =
    (over?.id === id || getDroppableParent(over?.id)?.id === id) &&
    ((!isSorting && !isDragging) || isOver);

  useEffect(() => {
    if (nodeRef.current && !isDragging) {
      setInitialWidth(nodeRef.current.getBoundingClientRect().width);
    }
  }, [nodeRef.current?.getBoundingClientRect()?.width]);

  const setRefs = (node) => {
    setDragRef(node);
    setDropRef(node);
    nodeRef.current = node;
  };

  let dopClassName = isDragging ? "opacity-0" : "";

  return (
    <div
      ref={setRefs}
      {...attributes}
      {...listeners}
      className={`mb-2 p-2 border border-slate-300 ${dopClassName}`}
      style={{
        border: totalIsOver && "1px dashed blue",
        transform: transform
          ? `translate(${transform.x || 0}px, ${transform.y || 0}px)`
          : "none",
        transition,
        width: isDragging ? `${initialWidth}px` : "100%",
        minHeight: totalIsOver
          ? 40 + (subItems.length > 0 ? subItems.length * 40 : 0)
          : 40,
      }}
      data-id={id}
    >
      <div style={{ marginBottom: "4px" }}>{body}</div>

      <div style={{ marginLeft: 16 }}>
        <SortableContext
          items={subItems.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {subItems.map((child) => (
            <ContentItem
              key={child.id}
              item={child}
              getDroppableParent={getDroppableParent}
              activeDrag={activeDrag}
              setItems={setItems}
              tableStructure={tableStructure}
              setActiveTableDetails={setActiveTableDetails}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default DraggableItemWithChildren;
