import React, { useEffect, useRef, useState } from "react";
import { DndContext, useDroppable, DragOverlay } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cloneObject, generateRandomString } from "../../../utils";

const sidebarId = "parent1";
const dropdownId = "parent2";

const itemsParent1 = [
  { type: "1", body: "1", subItems: [] },
  { type: "2", body: "2" },
  { type: "3", body: "3" },
];

const ItemByType = ({ item }) => {
  if (item.type === "1") {
    return <NestableDraggable item={item} />;
  }

  return <UniversalDraggable item={item} />;
};

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

  const updateItemRecursively = (items, overId, itemDetails) => {
    return items.map((item) => {
      if (item.type === "1" && item.id === overId) {
        return {
          ...item,
          subItems: [
            ...(item.subItems || []),
            { ...cloneObject(itemDetails), id: generateRandomString() },
          ],
        };
      }

      if (item.subItems && item.subItems.length > 0) {
        return {
          ...item,
          subItems: updateItemRecursively(item.subItems, overId, itemDetails),
        };
      }

      return item;
    });
  };

  const removeItemRecursively = (items, targetId) => {
    return items
      .map((item) => {
        if (item.id === targetId) {
          return null;
        }

        if (item.subItems && item.subItems.length > 0) {
          return {
            ...item,
            subItems: removeItemRecursively(item.subItems, targetId),
          };
        }

        return item;
      })
      .filter(Boolean); // Видаляє null
  };

  const reorderItemRecursively = (items, activeId, overId) => {
    const findAndReorder = (arr) => {
      const oldIndex = arr.findIndex((item) => item.id === activeId);
      const newIndex = arr.findIndex((item) => item.id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        return arrayMove(arr, oldIndex, newIndex);
      }

      return arr.map((item) => {
        if (item.subItems && item.subItems.length > 0) {
          return {
            ...item,
            subItems: findAndReorder(item.subItems),
          };
        }

        return item;
      });
    };

    return findAndReorder(items);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const isNew = active.data.current?.example;
    setActiveDrag(null);

    const parent2Rect = parent2Ref.current?.getBoundingClientRect();
    const mouseX = currentMouseRef.current.screenX;
    const mouseY = currentMouseRef.current.screenY;

    // Видалення: якщо перетягнули елемент з правої колонки і відпустили не над droppable
    if (!over || over.id === sidebarId) {
      if (!isNew) {
        setItemsParent2((items) => removeItemRecursively(items, active.id));
      }

      return;
    }

    // Додаємо новий елемент у правий блок
    if (isNew) {
      const itemDetails = itemsParent1.find((item) => item.type === active.id);

      if (over.id === dropdownId) {
        setItemsParent2([
          ...itemsParent2,
          { ...cloneObject(itemDetails), id: generateRandomString() },
        ]);
      } else {
        setItemsParent2((items) =>
          updateItemRecursively(items, over.id, itemDetails)
        );
      }

      return;
    }

    // Пересортовування у правому блоці
    if (!isNew && over.id !== active.id && over.id !== dropdownId) {
      setItemsParent2((items) =>
        reorderItemRecursively(items, active.id, over.id)
      );
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex space-x-4 w-full h-full h-max-full overflow-y-hidden">
        <DroppableParent1>
          {itemsParent1.map((item) => (
            <UniversalDraggable key={item.type} item={item} example />
          ))}
        </DroppableParent1>

        <DroppableParent2 ref={parent2Ref}>
          <SortableContext
            id={dropdownId}
            items={itemsParent2.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {itemsParent2.map((item) => (
              <ItemByType item={item} key={item.id} />
            ))}
          </SortableContext>
        </DroppableParent2>
      </div>
      <DragOverlay dropAnimation={null}>
        {activeDrag ? (
          <OverlayContent
            active={activeDrag}
            examples={itemsParent1}
            items={itemsParent2}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

const ItemTree = ({ item }) => (
  <div className="cursor-pointer p-2 mb-2 border border-slate-300 bg-white">
    {item.body}
    {item.subItems?.map((subItem) => (
      <ItemTree key={subItem.id} item={subItem} />
    ))}
  </div>
);

// OverlayContent — що показувати під час drag
const OverlayContent = ({ active, examples, items }) => {
  let item = null;
  const isNew = active.data.current?.example;

  const findItemById = (items, id) => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.subItems) {
        const found = findItemById(item.subItems, id);
        if (found) return found;
      }
    }
    return null;
  };

  if (isNew) {
    item = examples.find((i) => i.type === active.id);
  } else {
    item = findItemById(items, active.id);
  }
  return <ItemTree item={item} />;
};

const DroppableParent1 = React.forwardRef(function DroppableParent1(
  props,
  ref
) {
  const { setNodeRef } = useDroppable({ id: sidebarId });

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
  const { setNodeRef } = useDroppable({ id: dropdownId });
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

const UniversalDraggable = ({ item, example = false }) => {
  const { id, type, body } = item;
  const [initialWidth, setInitialWidth] = useState(0);
  const [initialHeight, setInitialHeight] = useState(0);

  const nodeRef = useRef(null);

  // Вибір хука
  const dnd = useSortable({ id: id ?? type, data: { example } });

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

  let dopClassName = isDragging ? "opacity-0" : "";

  const renderComponent = (childComponent = "") => (
    <div
      ref={(node) => {
        setNodeRef(node);
        nodeRef.current = node;
      }}
      {...listeners}
      {...attributes}
      className={`cursor-pointer p-2 mb-2 border border-slate-300 ${dopClassName} ${childComponent}`}
      style={{
        transform: transform
          ? `translate(${transform.x || 0}px, ${transform.y || 0}px)`
          : "none",
        transition,
        zIndex: isDragging ? 100 : "auto",
        width: isDragging ? `${initialWidth}px` : "100%",
      }}
    >
      {body}
    </div>
  );

  if (!example) {
    return renderComponent();
  }

  return (
    <div className="relative">
      <div className="cursor-pointer p-2 mb-2 border border-slate-300 bg-white absolute top-0 left-0 w-full">
        {body}
      </div>
      {renderComponent("relative z-100")}
    </div>
  );
};

const NestableDraggable = ({ item }) => {
  const { id, body, subItems = [] } = item;
  const [initialWidth, setInitialWidth] = useState(0);
  const nodeRef = useRef(null);

  // draggable
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
    transform,
    transition,
    over,
  } = useSortable({ id });

  // droppable
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id,
  });

  const totalIsOver = isOver && (!isDragging || over?.id !== id);

  useEffect(() => {
    if (nodeRef.current && !isDragging) {
      setInitialWidth(nodeRef.current.getBoundingClientRect().width);
    }
  }, [nodeRef.current?.getBoundingClientRect()?.width]);

  // combine refs
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
      className={`cursor-pointer p-2 mb-2 border border-slate-300 ${dopClassName}`}
      style={{
        border: totalIsOver && "1px dashed blue",
        transform: transform
          ? `translate(${transform.x || 0}px, ${transform.y || 0}px)`
          : "none",
        transition,
        width: isDragging ? `${initialWidth}px` : "100%",
        minHeight: totalIsOver
          ? 40 + (subItems.length > 0 ? subItems.length * 40 : 40)
          : 40,
      }}
    >
      <div>{body}</div>
      <div style={{ marginLeft: 16 }}>
        <SortableContext
          items={subItems.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {subItems.map((child) => (
            <ItemByType item={child} key={child.id} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default Builder;
