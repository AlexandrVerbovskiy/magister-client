import React from "react";
import STATIC from "../../../static";
import TableSelect from "./TableSelect";

const FieldBlock = ({ label, value }) => (
  <div className="w-full sm:w-[calc(100%-4px)]">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <div className="w-full btn justify-between min-w-44 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-500 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-200">
      {value || `Select ${label.toLowerCase()}`}
    </div>
  </div>
);

const ItemTree = ({ item }) => {
  if (item.key === STATIC.DISPUTE_PREDICTION_BLOCK.CUSTOM.TABLE_SELECTS.key) {
    return (
      <div
        className="cursor-pointer p-2 mb-2 border border-slate-300"
        style={{
          width: "100%",
          minHeight: 80,
        }}
      >
        <div className="w-full mb-4 flex gap-2">
          <FieldBlock label="Table Name" value={item.content.tableName} />
          <FieldBlock label="Field Name" value={item.content.fieldName} />
        </div>
        <div className="w-full mb-4 flex gap-2">
          <FieldBlock
            label="Connection Table Name"
            value={item.content.connectTableName}
          />
          <FieldBlock
            label="Connection Field Name"
            value={item.content.connectFieldName}
          />
        </div>
      </div>
    );
  }

  return (
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
