import STATIC from "../../../static";

const Query = ({ tableStructure, items, pseudonym, conditions }) => {
  let query = "";

  const addQueryByItem = (item) => {
    const datePartKeys = {
      [STATIC.DISPUTE_PREDICTION_BLOCK.WITH_CHILDREN.DAY.key]: "day",
      [STATIC.DISPUTE_PREDICTION_BLOCK.WITH_CHILDREN.DOW.key]: "dow",
      [STATIC.DISPUTE_PREDICTION_BLOCK.WITH_CHILDREN.DOY.key]: "doy",
      [STATIC.DISPUTE_PREDICTION_BLOCK.WITH_CHILDREN.HOUR.key]: "hour",
      [STATIC.DISPUTE_PREDICTION_BLOCK.WITH_CHILDREN.MONTH.key]: "month",
      [STATIC.DISPUTE_PREDICTION_BLOCK.WITH_CHILDREN.QUARTER.key]: "quarter",
      [STATIC.DISPUTE_PREDICTION_BLOCK.WITH_CHILDREN.WEEK.key]: "week",
      [STATIC.DISPUTE_PREDICTION_BLOCK.WITH_CHILDREN.YEAR.key]: "year",
    };

    const functionWrappers = {
      [STATIC.DISPUTE_PREDICTION_BLOCK.WITH_CHILDREN.BRACKETS.key]: ["(", ")"],
      [STATIC.DISPUTE_PREDICTION_BLOCK.WITH_CHILDREN.AVG.key]: ["AVG(", ")"],
      [STATIC.DISPUTE_PREDICTION_BLOCK.WITH_CHILDREN.SUM.key]: ["SUM(", ")"],
      ...Object.fromEntries(
        Object.entries(datePartKeys).map(([key, part]) => [
          key,
          [`date_part('${part}',`, ")"],
        ])
      ),
    };

    const wrapper = functionWrappers[item.key];

    if (wrapper) {
      query += wrapper[0];
      item.subItems.forEach(addQueryByItem);
      query += wrapper[1];
    }

    if (
      Object.values(STATIC.DISPUTE_PREDICTION_BLOCK.OPERATIONS)
        .map((item) => item.key)
        .includes(item.key)
    ) {
      query += ` ${item.key} `;
    }

    if (item.key === STATIC.DISPUTE_PREDICTION_BLOCK.CUSTOM.TABLE_SELECTS.key) {
      query += `${item.content.tableName}.${item.content.fieldName}`;
    }
  };

  if (items.length > 0) {
    query = "SELECT ";

    items.forEach(addQueryByItem);

    if (pseudonym) {
      query += ` as ${pseudonym}`;
    }

    query += " FROM orders";

    items.forEach((item) => {
      if (
        item.key !== STATIC.DISPUTE_PREDICTION_BLOCK.CUSTOM.TABLE_SELECTS.key
      ) {
        return;
      }

      item.content.joins.forEach((join) => {
        query += ` LEFT JOIN ${join.joinedTable} as ${join.pseudonym} ON ${join.joinedTable}.${join.joinedField} = ${join.baseTable}.${join.baseField}`;
      });
    });

    if (conditions.length > 0) {
      query += ` WHERE `;

      conditions.forEach((condition, index) => {
        if (index > 0) {
          query += " AND ";
        }

        query += `${condition.baseTable}.${condition.baseField} ${condition.joinCondition} ${condition.joinedTable}.${condition.joinedField}`;
      });
    }
  }

  return (
    <div>
      <label className="block text-sm font-semibold mb-1 text-black">
        SQL-query
      </label>
      <div
        className="w-full bg-gray-100 border border-slate-200 px-3 py-2 text-sm leading-5 text-slate-800 shadow-sm overflow-y-auto overflow-x-hidden"
        style={{ height: "120px" }}
      >
        {query}
      </div>
    </div>
  );
};

export default Query;
