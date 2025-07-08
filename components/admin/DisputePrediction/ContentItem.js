import DraggableItem from "./DraggableItem";
import DraggableItemWithChildren from "./DraggableItemWithChildren";

const ItemByType = ({ item, getDroppableParent, activeDrag }) => {
  if (item.type === "1") {
    return (
      <DraggableItemWithChildren
        item={item}
        activeDrag={activeDrag}
        getDroppableParent={getDroppableParent}
      />
    );
  }

  return <DraggableItem item={item} />;
};

export default ItemByType;
