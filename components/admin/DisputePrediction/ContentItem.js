import { useState } from "react";
import STATIC from "../../../static";
import { cloneObject, isItemKeyDraggable } from "../../../utils";
import DraggableItem from "./DraggableItem";
import DraggableItemWithChildren from "./DraggableItemWithChildren";

const ContentItem = ({
  tableStructure,
  item,
  setActiveTableDetails,
  getDroppableParent,
  activeDrag,
}) => {
  if (isItemKeyDraggable(item.key)) {
    return (
      <DraggableItemWithChildren
        item={item}
        activeDrag={activeDrag}
        getDroppableParent={getDroppableParent}
        setActiveTableDetails={setActiveTableDetails}
        tableStructure={tableStructure}
      />
    );
  }

  if (item.key === STATIC.DISPUTE_PREDICTION_BLOCK.CUSTOM.TABLE_SELECTS.key) {
    return (
      <DraggableItem item={item}>
        <div
          className="drag-ignore-section w-fit position-relative z-1"
          onClick={() => setActiveTableDetails(item)}
        >
          {item.content.pseudonym || "-"}
        </div>
      </DraggableItem>
    );
  }

  return <DraggableItem item={item}>{item.body}</DraggableItem>;
};

export default ContentItem;
