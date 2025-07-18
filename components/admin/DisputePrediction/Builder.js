import React, { useRef, useState } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
  cloneObject,
  generateRandomString,
  isItemKeyDraggable,
} from "../../../utils";
import Sidebar from "./Sidebar";
import Content from "./Content";
import ContentItem from "./ContentItem";
import OverlayItem from "./OverlayItem";
import DraggableItem from "./DraggableItem";
import STATIC from "../../../static";
import Query from "./Query";
import Where from "./Where";
import ModelParamFieldModal from "./ModelParamFieldModal";

const sidebarId = "dispute-prediction-sidebar";
const dropdownId = "dispute-prediction-content";

const withChildrenItems = Object.keys(
  STATIC.DISPUTE_PREDICTION_BLOCK.WITH_CHILDREN
).map((operationKey) => ({
  key: STATIC.DISPUTE_PREDICTION_BLOCK.WITH_CHILDREN[operationKey].key,
  body: STATIC.DISPUTE_PREDICTION_BLOCK.WITH_CHILDREN[operationKey].label,
  subItems: [],
}));

const operationItems = Object.keys(
  STATIC.DISPUTE_PREDICTION_BLOCK.OPERATIONS
).map((operationKey) => ({
  key: STATIC.DISPUTE_PREDICTION_BLOCK.OPERATIONS[operationKey].key,
  body: STATIC.DISPUTE_PREDICTION_BLOCK.OPERATIONS[operationKey].label,
}));

const customItems = Object.keys(STATIC.DISPUTE_PREDICTION_BLOCK.CUSTOM).map(
  (operationKey) => ({
    key: STATIC.DISPUTE_PREDICTION_BLOCK.CUSTOM[operationKey].key,
    body: STATIC.DISPUTE_PREDICTION_BLOCK.CUSTOM[operationKey].label,
    content: {
      tableName: null,
      fieldName: null,
      pseudonym: "",
      joins: [],
    },
  })
);

const Builder = ({ tableStructure, dopProps }) => {
  const contentRef = useRef(null);
  const [activeDrag, setActiveDrag] = useState(null);
  const [activeTableDetails, setActiveTableDetails] = useState(null);

  const handleDragStart = (event) => {
    setActiveDrag(event.active);
  };

  const getDroppableParent = (
    itemId,
    checkableItems = null,
    needCheck = true
  ) => {
    if (checkableItems === null) {
      checkableItems = dopProps.content;
    }

    for (let i = 0; i < checkableItems.length; i++) {
      const checkableItem = checkableItems[i];

      if (isItemKeyDraggable(checkableItem.key)) {
        for (let j = 0; j < checkableItem.subItems.length; j++) {
          const checkableChild = checkableItem.subItems[j];

          if (needCheck && !isItemKeyDraggable(checkableChild.key)) {
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

  const updateItemSubItemsRecursively = (items, overId, itemDetails) => {
    return items.map((item) => {
      if (isItemKeyDraggable(item.key)) {
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

          if (childItem.id === overId && !isItemKeyDraggable(childItem.key)) {
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
          subItems: updateItemSubItemsRecursively(
            item.subItems,
            overId,
            itemDetails
          ),
        };
      }

      return item;
    });
  };

  const updateItemRecursively = (prevItems, overId, itemDetails) => {
    return prevItems.map((item) => {
      if (item.id === overId) {
        return cloneObject({
          ...item,
          ...itemDetails,
        });
      }

      if (item.subItems && item.subItems.length > 0) {
        return cloneObject({
          ...item,
          subItems: updateItemRecursively(item.subItems, overId, itemDetails),
        });
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
          return cloneObject({
            ...item,
            subItems: removeItemRecursively(item.subItems, targetId),
          });
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
      items = dopProps.content;
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
        dopProps.setContent((items) => removeItemRecursively(items, active.id));
      }

      return;
    }

    if (over.id === active.id) {
      return;
    }

    const itemDetails = isExample
      ? {
          ...cloneObject(
            [...withChildrenItems, ...operationItems, ...customItems].find(
              (item) => item.key === active.id
            )
          ),
          id: generateRandomString(),
        }
      : getItemById(active.id);

    if (over.id === dropdownId) {
      return dopProps.setContent((prevItemsPaten2) => {
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
      for (let i = 0; i < dopProps.content.length; i++) {
        const childItem = dopProps.content[i];

        if (childItem.id === over.id && !isItemKeyDraggable(childItem.key)) {
          return dopProps.setContent([
            ...dopProps.content,
            { ...cloneObject(itemDetails), id: generateRandomString() },
          ]);
        }
      }

      return dopProps.setContent((items) =>
        updateItemSubItemsRecursively(items, over.id, itemDetails)
      );
    }

    const overDetails = getItemById(over.id);
    const activeDetails = getItemById(active.id);

    if (
      getDroppableParent(active.id, null, false)?.id ===
      getDroppableParent(over.id, null, false)?.id
    ) {
      return dopProps.setContent((items) =>
        reorderItemRecursively(items, active.id, over.id)
      );
    } else {
      if (!isItemKeyDraggable(overDetails.key)) {
        return;
      }

      return dopProps.setContent((prevItemsPaten2) => {
        const [filtered] = findAndRemoveItem(prevItemsPaten2, active.id);
        return insertItemById(filtered, over.id, itemDetails);
      });
    }
  };

  const setTableDetails = ({ tableName, fieldName, joins, pseudonym }) => {
    dopProps.setContent((prevItems) =>
      updateItemRecursively(prevItems, activeTableDetails.id, {
        content: { tableName, fieldName, joins, pseudonym },
      })
    );
  };

  return (
    <>
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex space-x-4 w-full h-full h-max-full overflow-y-hidden mb-4">
          <Sidebar
            id={sidebarId}
            items={[
              {
                label: "Combined Operations",
                list: withChildrenItems,
              },
              {
                label: "Math Operations",
                list: operationItems,
              },
              {
                label: "Custom Operations",
                list: customItems,
              },
            ]}
            keyField="key"
            bodyField="body"
            Component={({ item }) => (
              <DraggableItem item={item} example>
                {item.body}
              </DraggableItem>
            )}
          />

          <Content
            ref={contentRef}
            id={dropdownId}
            items={dopProps.content}
            keyField="id"
            Component={({ item }) => (
              <ContentItem
                tableStructure={tableStructure}
                item={item}
                getDroppableParent={getDroppableParent}
                key={item.id}
                activeDrag={activeDrag}
                setActiveTableDetails={setActiveTableDetails}
              />
            )}
          />

          <Where
            tableStructure={tableStructure}
            items={dopProps.content}
            {...dopProps}
          />
        </div>

        <Query
          tableStructure={tableStructure}
          items={dopProps.content}
          {...dopProps}
        />

        <DragOverlay dropAnimation={null}>
          {activeDrag ? (
            <OverlayItem
              active={activeDrag}
              examples={[
                ...withChildrenItems,
                ...operationItems,
                ...customItems,
              ]}
              items={dopProps.content}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <ModelParamFieldModal
        tableStructure={tableStructure}
        onSaveClick={setTableDetails}
        modalOpen={!!activeTableDetails}
        closeModal={() => setActiveTableDetails(null)}
        pseudonym={activeTableDetails?.content?.pseudonym ?? ""}
        fieldName={activeTableDetails?.content?.fieldName ?? ""}
        tableName={activeTableDetails?.content?.tableName ?? ""}
        joins={activeTableDetails?.content?.joins ?? []}
      />
    </>
  );
};

export default Builder;
