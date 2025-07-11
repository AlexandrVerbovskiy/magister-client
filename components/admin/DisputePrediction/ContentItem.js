import STATIC from "../../../static";
import { isItemKeyDraggable } from "../../../utils";
import DraggableItem from "./DraggableItem";
import DraggableItemWithChildren from "./DraggableItemWithChildren";
import TableSelect from "./TableSelect";

const ContentItem = ({
  tableStructure,
  item,
  setItems,
  getDroppableParent,
  activeDrag,
}) => {
  if (isItemKeyDraggable(item.key)) {
    return (
      <DraggableItemWithChildren
        item={item}
        activeDrag={activeDrag}
        getDroppableParent={getDroppableParent}
        setItems={setItems}
        tableStructure={tableStructure}
      />
    );
  }

  if (item.key === STATIC.DISPUTE_PREDICTION_BLOCK.CUSTOM.TABLE_SELECTS.key) {
    const setItemPart = (name, value) =>
      setItems((prevItems) =>
        prevItems.map((prevItem) => {
          if (prevItem.id !== item.id) {
            return prevItem;
          }

          return {
            ...prevItem,
            content: { ...prevItem.content, [name]: value },
          };
        })
      );

    return (
      <DraggableItem item={item}>
        <TableSelect
          tableStructure={tableStructure}
          tableName={item.content.tableName}
          setTableName={(newValue) => setItemPart("tableName", newValue)}
          fieldName={item.content.fieldName}
          setFieldName={(newValue) => setItemPart("fieldName", newValue)}
          connectTableName={item.content.connectTableName}
          setConnectTableName={(newValue) =>
            setItemPart("connectTableName", newValue)
          }
          connectFieldName={item.content.connectFieldName}
          setConnectFieldName={(newValue) =>
            setItemPart("connectFieldName", newValue)
          }
        />
      </DraggableItem>
    );
  }

  return <DraggableItem item={item}>{item.body}</DraggableItem>;
};

export default ContentItem;
