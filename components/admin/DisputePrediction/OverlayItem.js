import React from "react";

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
    item = examples.find((i) => i.type === active.id);
  } else {
    item = findItemById(items, active.id);
  }
  return <ItemTree item={item} />;
};

export default OverlayItem;
