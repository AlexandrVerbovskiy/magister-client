import STATIC from "../../../static";

const ItemTree = ({ item }) => {
  if (item.key === STATIC.DISPUTE_PREDICTION_BLOCK.CUSTOM.TABLE_SELECTS.key) {
    return (
      <div
        className="cursor-pointer p-2 text-sm mb-2 border border-slate-300 w-full"
        style={{ transform: "none", zIndex: "auto", width: "100%" }}
      >
        {item.content.pseudonym || "-"}
      </div>
    );
  }

  return (
    <div
      className="cursor-pointer p-2 mb-2 border border-slate-300 w-full"
      style={{
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
};

const OverlayItem = ({ active, examples, items }) => {
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
    item = examples.find((i) => i.key === active.id);
  } else {
    item = findItemById(items, active.id);
  }
  return <ItemTree item={item} />;
};

export default OverlayItem;
