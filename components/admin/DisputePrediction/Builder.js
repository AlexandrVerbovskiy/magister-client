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

const ItemByType = ({ item, getDroppableParent, activeDrag }) => {
  if (item.type === "1") {
    return (
      <NestableDraggable
        item={item}
        activeDrag={activeDrag}
        getDroppableParent={getDroppableParent}
      />
    );
  }

  return <UniversalDraggable item={item} />;
};

const Builder = () => {
  const parent2Ref = useRef(null);
  const [itemsParent2, setItemsParent2] = useState([]);
  const [activeDrag, setActiveDrag] = useState(null); // Для overlay

  const handleDragStart = (event) => {
    setActiveDrag(event.active);
  };

  const getDroppableParent = (
    itemId,
    checkableItems = null,
    needCheck = true
  ) => {
    if (checkableItems === null) {
      checkableItems = itemsParent2;
    }

    for (let i = 0; i < checkableItems.length; i++) {
      const checkableItem = checkableItems[i];

      if (checkableItem.type === "1") {
        for (let j = 0; j < checkableItem.subItems.length; j++) {
          const checkableChild = checkableItem.subItems[j];

          if (needCheck && checkableChild.type !== "1") {
            break;
          }

          if (checkableChild.id === itemId) {
            return checkableItem;
          }
        }

        const resChildCheck = getDroppableParent(
          itemId,
          checkableItem.subItems,
          needCheck
        );

        if (resChildCheck) {
          return resChildCheck;
        }
      }
    }

    return null;
  };

  const updateItemRecursively = (items, overId, itemDetails) => {
    return items.map((item) => {
      if (item.type === "1") {
        if (item.id === overId) {
          return {
            ...item,
            subItems: [
              ...(item.subItems || []),
              { ...cloneObject(itemDetails), id: generateRandomString() },
            ],
          };
        }

        for (let i = 0; i < item.subItems.length; i++) {
          const childItem = item.subItems[i];

          if (childItem.id === overId && childItem.type !== "1") {
            return {
              ...item,
              subItems: [
                ...(item.subItems || []),
                { ...cloneObject(itemDetails), id: generateRandomString() },
              ],
            };
          }
        }
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

  const insertItemById = (items, targetId, itemToInsert) => {
    return items.map((item) => {
      if (item.id === targetId) {
        return {
          ...item,
          subItems: [...(item.subItems || []), itemToInsert],
        };
      }

      if (item.subItems?.length) {
        return {
          ...item,
          subItems: insertItemById(item.subItems, targetId, itemToInsert),
        };
      }

      return item;
    });
  };

  const findAndRemoveItem = (items, targetId) => {
    let found = null;

    const filtered = items
      .map((item) => {
        if (item.id === targetId) {
          found = item;
          return null;
        }

        if (item.subItems?.length) {
          const [cleanedChildren, removed] = findAndRemoveItem(
            item.subItems,
            targetId
          );
          if (removed) {
            found = removed;
            return { ...item, subItems: cleanedChildren };
          }
        }

        return item;
      })
      .filter(Boolean);

    return [filtered, found];
  };

  const getItemById = (id, items = null) => {
    if (items === null) {
      items = itemsParent2;
    }

    for (let item of items) {
      if (item.id === id) {
        return item;
      }

      if (item.subItems && item.subItems.length > 0) {
        const foundItem = getItemById(id, item.subItems);
        if (foundItem) {
          return foundItem;
        }
      }
    }
    return null;
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const isNew = active.data.current?.example;
    setActiveDrag(null);

    // Видалення: якщо перетягнули елемент з правої колонки і відпустили не над droppable
    if (!over || over.id === sidebarId) {
      if (!isNew) {
        setItemsParent2((items) => removeItemRecursively(items, active.id));
      }

      return;
    }

    if (over.id === active.id) {
      return;
    }

    const itemDetails = isNew
      ? {
          ...cloneObject(itemsParent1.find((item) => item.type === active.id)),
          id: generateRandomString(),
        }
      : getItemById(active.id);

    if (over.id === dropdownId) {
      return setItemsParent2((prevItemsPaten2) => {
        let res = [];

        if (isNew) {
          res = prevItemsPaten2;
        } else {
          let [filtered] = findAndRemoveItem(prevItemsPaten2, active.id);
          res = filtered;
        }

        return [...res, itemDetails];
      });
    }

    // Додаємо новий елемент у правий блок
    if (isNew) {
      for (let i = 0; i < itemsParent2.length; i++) {
        const childItem = itemsParent2[i];

        if (childItem.id === over.id && childItem.type !== "1") {
          return setItemsParent2([
            ...itemsParent2,
            { ...cloneObject(itemDetails), id: generateRandomString() },
          ]);
        }
      }

      return setItemsParent2((items) =>
        updateItemRecursively(items, over.id, itemDetails)
      );
    }

    const overDetails = getItemById(over.id);
    const activeDetails = getItemById(active.id);

    // Пересортовування у правому блоці
    if (
      getDroppableParent(active.id, null, false)?.id ===
      getDroppableParent(over.id, null, false)?.id
    ) {
      return setItemsParent2((items) =>
        reorderItemRecursively(items, active.id, over.id)
      );
    } else {
      if (overDetails.type !== "1") {
        return;
      }

      return setItemsParent2((prevItemsPaten2) => {
        const [filtered] = findAndRemoveItem(prevItemsPaten2, active.id);
        return insertItemById(filtered, over.id, itemDetails);
      });
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex space-x-4 w-full h-full h-max-full overflow-y-hidden">
        <DroppableParent1>
          {itemsParent1.map((item) => (
            <div className="relative" key={item.type}>
              <div className="cursor-pointer p-2 mb-2 border border-slate-300 bg-white absolute top-0 left-0 w-full">
                {item.body}
              </div>

              <UniversalDraggable item={item} example />
            </div>
          ))}
        </DroppableParent1>

        <DroppableParent2 ref={parent2Ref} items={itemsParent2}>
          <SortableContext
            id={dropdownId}
            items={itemsParent2.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {itemsParent2.map((item) => (
              <ItemByType
                item={item}
                getDroppableParent={getDroppableParent}
                key={item.id}
                activeDrag={activeDrag}
              />
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
  <div
    className="cursor-pointer p-2 mb-2 border border-slate-300"
    style={{
      width: "100%",
      minHeight: 40 + (item.subItems?.length ? item.subItems.length * 40 : 0),
    }}
  >
    {item.body}

    {item.subItems && (
      <div style={{ marginRight: "16px" }}>
        {item.subItems.map((subItem) => (
          <ItemTree key={subItem.id} item={subItem} />
        ))}
      </div>
    )}
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
      data-id={sidebarId}
    >
      {props.children}
    </div>
  );
});

const DroppableParent2 = React.forwardRef(function DroppableParent2(
  props,
  ref
) {
  const { setNodeRef, over } = useDroppable({ id: dropdownId });
  let totalIsOver = over?.id === dropdownId;

  if (!totalIsOver && over?.id) {
    for (let i = 0; i < props.items.length; i++) {
      const checkableChild = props.items[i];

      if (checkableChild.id === over?.id && checkableChild.type !== "1") {
        totalIsOver = true;
      }
    }
  }

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        if (ref) ref.current = node;
      }}
      className="w-3/4 border border-slate-200 px-3 py-2 text-sm leading-5 text-slate-800 shadow-sm h-full overflow-y-auto"
      style={{
        border: totalIsOver && "1px dashed blue",
      }}
      data-id={dropdownId}
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

  if (example) {
    dopClassName += " relative z-100";
  }

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        nodeRef.current = node;
      }}
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

const NestableDraggable = ({ item, activeDrag, getDroppableParent }) => {
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
    isSorting,
    isOver,
  } = useSortable({ id });

  // droppable
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
      {/* Окрема зона для drag handle */}
      <div>{body}</div>

      {/* Інший контент, який не є draggable */}
      <div style={{ marginLeft: 16 }}>
        <SortableContext
          items={subItems.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {subItems.map((child) => (
            <ItemByType
              key={child.id}
              item={child}
              getDroppableParent={getDroppableParent}
              activeDrag={activeDrag}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default Builder;
