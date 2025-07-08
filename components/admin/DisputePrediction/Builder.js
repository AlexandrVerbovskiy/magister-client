import React, { useRef, useState } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { cloneObject, generateRandomString } from "../../../utils";
import Sidebar from "./Sidebar";
import Content from "./Content";
import ContentItem from "./ContentItem";
import OverlayItem from "./OverlayItem";
import DraggableItem from "./DraggableItem";

const sidebarId = "dispute-prediction-sidebar";
const dropdownId = "dispute-prediction-content";

const sidebarItems = [
  { type: "1", body: "1", subItems: [] },
  { type: "2", body: "2" },
  { type: "3", body: "3" },
];

const Builder = () => {
  const contentRef = useRef(null);
  const [contentItems, setContentItems] = useState([]);
  const [activeDrag, setActiveDrag] = useState(null);

  const handleDragStart = (event) => {
    setActiveDrag(event.active);
  };

  const getDroppableParent = (
    itemId,
    checkableItems = null,
    needCheck = true
  ) => {
    if (checkableItems === null) {
      checkableItems = contentItems;
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
      items = contentItems;
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
    const isExample = active.data.current?.example;
    setActiveDrag(null);

    if (!over || over.id === sidebarId) {
      if (!isExample) {
        setContentItems((items) => removeItemRecursively(items, active.id));
      }

      return;
    }

    if (over.id === active.id) {
      return;
    }

    const itemDetails = isExample
      ? {
          ...cloneObject(sidebarItems.find((item) => item.type === active.id)),
          id: generateRandomString(),
        }
      : getItemById(active.id);

    if (over.id === dropdownId) {
      return setContentItems((prevItemsPaten2) => {
        let res = [];

        if (isExample) {
          res = prevItemsPaten2;
        } else {
          let [filtered] = findAndRemoveItem(prevItemsPaten2, active.id);
          res = filtered;
        }

        return [...res, itemDetails];
      });
    }

    if (isExample) {
      for (let i = 0; i < contentItems.length; i++) {
        const childItem = contentItems[i];

        if (childItem.id === over.id && childItem.type !== "1") {
          return setContentItems([
            ...contentItems,
            { ...cloneObject(itemDetails), id: generateRandomString() },
          ]);
        }
      }

      return setContentItems((items) =>
        updateItemRecursively(items, over.id, itemDetails)
      );
    }

    const overDetails = getItemById(over.id);
    const activeDetails = getItemById(active.id);

    if (
      getDroppableParent(active.id, null, false)?.id ===
      getDroppableParent(over.id, null, false)?.id
    ) {
      return setContentItems((items) =>
        reorderItemRecursively(items, active.id, over.id)
      );
    } else {
      if (overDetails.type !== "1") {
        return;
      }

      return setContentItems((prevItemsPaten2) => {
        const [filtered] = findAndRemoveItem(prevItemsPaten2, active.id);
        return insertItemById(filtered, over.id, itemDetails);
      });
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex space-x-4 w-full h-full h-max-full overflow-y-hidden">
        <Sidebar
          id={sidebarId}
          items={sidebarItems}
          keyField="type"
          bodyField="body"
          Component={({ item }) => <DraggableItem item={item} example />}
        />

        <Content
          ref={contentRef}
          id={dropdownId}
          items={contentItems}
          keyField="id"
          Component={({ item }) => (
            <ContentItem
              item={item}
              getDroppableParent={getDroppableParent}
              key={item.id}
              activeDrag={activeDrag}
            />
          )}
        />
      </div>

      <DragOverlay dropAnimation={null}>
        {activeDrag ? (
          <OverlayItem
            active={activeDrag}
            examples={sidebarItems}
            items={contentItems}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Builder;
