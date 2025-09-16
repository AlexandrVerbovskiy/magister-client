import { useState } from "react";
import STATIC from "../../../static";
import { cloneObject, isItemKeyDraggable } from "../../../utils";
import DraggableItem from "./DraggableItem";
import DraggableItemWithChildren from "./DraggableItemWithChildren";
import Input from "../Form/Input";

const ContentItem = ({
  tableStructure,
  item,
  setActiveTableDetails,
  getDroppableParent,
  activeDrag,
  setCustomValue,
}) => {
  if (isItemKeyDraggable(item.key)) {
    return (
      <DraggableItemWithChildren
        item={item}
        activeDrag={activeDrag}
        getDroppableParent={getDroppableParent}
        setActiveTableDetails={setActiveTableDetails}
        tableStructure={tableStructure}
        setCustomValue={setCustomValue}
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

  if (item.key === STATIC.DISPUTE_PREDICTION_BLOCK.CUSTOM.CUSTOM_VALUE.key) {
    return (
      <DraggableItem item={item}>
        <div className="drag-ignore-section position-relative z-1 w-full">
          <Input
            inputClassName="w-full border-slate-300 focus:border-slate-300"
            value={item.content.value || ""}
            setValue={(newValue) =>
              setCustomValue({ id: item.id, value: newValue })
            }
          />
        </div>
      </DraggableItem>
    );
  }

  return <DraggableItem item={item}>{item.body}</DraggableItem>;
};

export default ContentItem;
