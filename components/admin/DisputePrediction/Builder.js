import React, { useEffect, useRef, useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cloneObject, generateRandomString } from "../../../utils";

const itemsParent1 = [
  { key: "1", body: "1" },
  { key: "2", body: "2" },
  { key: "3", body: "3" },
];

const Builder = () => {
  const parent2Ref = useRef(null);
  const [itemsParent2, setItemsParent2] = useState([]);
  const [activeDrag, setActiveDrag] = useState(null); // Для overlay
  const currentMouseRef = useRef(null);

  useEffect(() => {
    document.addEventListener(
      "mousemove",
      (e) => (currentMouseRef.current = e)
    );
  }, []);

  const handleDragStart = (event) => {
    setActiveDrag(event.active);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const isNew = active.data.current?.type === "new";
    setActiveDrag(null);

    const parent2Rect = parent2Ref.current?.getBoundingClientRect();
    const mouseX = currentMouseRef.current.screenX;
    const mouseY = currentMouseRef.current.screenY;

    const overParent2 =
      parent2Rect &&
      (mouseY < parent2Rect.top - 20 ||
        mouseY > parent2Rect.bottom + 20 ||
        mouseX < parent2Rect.left - 20 ||
        mouseX > parent2Rect.right + 20);

    // Видалення: якщо перетягнули елемент з правої колонки і відпустили не над droppable
    if (overParent2 && !isNew) {
      setItemsParent2((prevItems) =>
        prevItems.filter((item) => item.id !== active.id)
      );
      return;
    }

    if (overParent2) return;

    // Додаємо новий елемент у правий блок
    if (isNew) {
      const itemDetails = itemsParent1.find((item) => item.key === active.id);
      setItemsParent2([
        ...itemsParent2,
        { ...cloneObject(itemDetails), id: generateRandomString() },
      ]);
      return;
    }

    // Пересортовування у правому блоці
    if (!isNew && over.id !== active.id && over.id !== "parent2") {
      const oldIndex = itemsParent2.findIndex((item) => item.id === active.id);
      const newIndex = itemsParent2.findIndex((item) => item.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        setItemsParent2((items) => arrayMove(items, oldIndex, newIndex));
        return;
      }
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex space-x-4 w-full h-full h-max-full overflow-y-hidden">
        <DroppableParent1>
          {itemsParent1.map((item) => (
            <UniversalDraggable
              key={item.key}
              data={{ type: "new" }}
              id={item.key}
            >
              {item.body}
            </UniversalDraggable>
          ))}
        </DroppableParent1>

        <DroppableParent2 ref={parent2Ref}>
          <SortableContext
            id="parent2"
            items={itemsParent2.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {itemsParent2.map((item) => (
              <UniversalDraggable
                key={item.id}
                data={{ type: "old" }}
                id={item.id}
                sortable
              >
                {item.body}
              </UniversalDraggable>
            ))}
          </SortableContext>
        </DroppableParent2>
      </div>
      <DragOverlay dropAnimation={null}>
        {activeDrag ? (
          <OverlayContent
            active={activeDrag}
            itemsParent1={itemsParent1}
            itemsParent2={itemsParent2}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

// OverlayContent — що показувати під час drag
const OverlayContent = ({ active, itemsParent1, itemsParent2 }) => {
  const isNew = active.data.current?.type === "new";
  let content = null;
  if (isNew) {
    const item = itemsParent1.find((i) => i.key === active.id);
    content = item?.body;
  } else {
    const item = itemsParent2.find((i) => i.id === active.id);
    content = item?.body;
  }
  return (
    <div className="cursor-pointer p-2 mb-2 border border-slate-300 bg-white shadow-lg">
      {content}
    </div>
  );
};

const DroppableParent1 = React.forwardRef(function DroppableParent1(
  props,
  ref
) {
  const { setNodeRef } = useDroppable({ id: "parent1" });
  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        if (ref) ref.current = node;
      }}
      className="w-1/4 border border-slate-200 px-3 py-2 text-sm leading-5 text-slate-800 shadow-sm h-full overflow-y-auto overflow-x-hidden"
    >
      {props.children}
    </div>
  );
});

const DroppableParent2 = React.forwardRef(function DroppableParent2(
  props,
  ref
) {
  const { setNodeRef } = useDroppable({ id: "parent2" });
  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        if (ref) ref.current = node;
      }}
      className="w-3/4 border border-slate-200 px-3 py-2 text-sm leading-5 text-slate-800 shadow-sm h-full overflow-y-auto"
    >
      {props.children}
    </div>
  );
});

const UniversalDraggable = ({ id, children, data = {}, sortable = false }) => {
  const [initialWidth, setInitialWidth] = useState(0);
  const [initialHeight, setInitialHeight] = useState(0);

  const nodeRef = useRef(null);

  // Вибір хука
  const dnd = sortable ? useSortable({ id }) : useDraggable({ id, data });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = dnd;

  useEffect(() => {
    if (nodeRef.current && !isDragging) {
      setInitialWidth(nodeRef.current.getBoundingClientRect().width);
      setInitialHeight(nodeRef.current.getBoundingClientRect().height);
    }
  }, [
    nodeRef.current?.getBoundingClientRect()?.width,
    nodeRef.current?.getBoundingClientRect()?.height,
  ]);

  let opacityClassName = "";

  if (isDragging) {
    opacityClassName = sortable ? "opacity-0" : "opacity-50";
  }

  return (
    <>
      {!sortable && isDragging && (
        <div
          className={`p-2 mb-2 border border-slate-300`}
          style={{
            position: "relative",
            width: initialWidth,
            height: initialHeight,
          }}
        >
          {children}
        </div>
      )}

      <div
        ref={(node) => {
          setNodeRef(node);
          nodeRef.current = node;
        }}
        {...listeners}
        {...attributes}
        className={`cursor-pointer p-2 mb-2 border border-slate-300 ${opacityClassName}`}
        style={{
          position: isDragging ? "absolute" : "relative",
          transform: transform
            ? `translate(${transform.x || 0}px, ${transform.y || 0}px)`
            : "none",
          transition: isDragging ? transition : null,
          zIndex: isDragging ? 100 : 0,
          width: isDragging ? `${initialWidth}px` : "auto",
        }}
      >
        {children}
      </div>
    </>
  );
};

export default Builder;
