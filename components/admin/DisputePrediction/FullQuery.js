import STATIC from "../../../static";
import { isKeyOperation } from "../../../utils/helpers";

const swapSubOrdersTable = (table) => {
  if (table == "orders") {
    return "suborder";
  }

  return table;
};

const FullQuery = ({ modelParams }) => {
  let query = "SELECT ";
  const joins = {};

  const addQueryByItem = (item, innerJoins, innerParts) => {
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
      [STATIC.DISPUTE_PREDICTION_BLOCK.WITH_CHILDREN.COUNT.key]: [
        "COUNT(",
        ")",
      ],
      [STATIC.DISPUTE_PREDICTION_BLOCK.WITH_CHILDREN.IS_NULL.key]: [
        "(",
        " IS NULL)",
      ],
      [STATIC.DISPUTE_PREDICTION_BLOCK.WITH_CHILDREN.IS_NOT_NULL.key]: [
        "(",
        " IS NOT NULL)",
      ],
      ...Object.fromEntries(
        Object.entries(datePartKeys).map(([key, part]) => [
          key,
          [`date_part('${part}', `, ")"],
        ])
      ),
    };

    const wrapper = functionWrappers[item.key];
    if (wrapper) {
      innerParts.push(wrapper[0]);
      item.subItems.forEach((subItem, idx) => {
        if (
          idx > 0 &&
          !isKeyOperation(item.subItems[idx - 1].key) &&
          !isKeyOperation(subItem.key) &&
          !(
            idx !== item.subItems.length - 1 &&
            isKeyOperation(item.subItems[idx + 1].key)
          )
        ) {
          innerParts.push(", ");
        }

        addQueryByItem(subItem, innerJoins, innerParts);
      });
      innerParts.push(wrapper[1]);
    }

    if (isKeyOperation(item.key)) {
      innerParts.push(` ${item.key} `);
    }

    if (item.key === STATIC.DISPUTE_PREDICTION_BLOCK.CUSTOM.CUSTOM_VALUE.key) {
      innerParts.push(item.content.value);
    }

    if (item.key === STATIC.DISPUTE_PREDICTION_BLOCK.CUSTOM.TABLE_SELECTS.key) {
      innerParts.push(
        `${swapSubOrdersTable(item.content.tableName)}.${
          item.content.fieldName
        }`
      );
      item.content.joins.forEach((join) => {
        innerJoins[join.pseudonym] = `LEFT JOIN ${join.joinedTable} as ${
          join.pseudonym
        } ON ${join.pseudonym}.${join.joinedField} = ${swapSubOrdersTable(
          join.baseTable
        )}.${join.baseField}`;
      });
    }
  };

  modelParams.forEach((field, idx) => {
    if (idx > 0) {
      query += ", ";
    }

    if (field.type === "field") {
      query += `${field.content.tableName}.${field.content.fieldName}`;

      if (field.pseudonym) {
        query += ` as ${field.pseudonym}`;
      }

      field.content.joins.forEach((join) => {
        joins[
          join.pseudonym
        ] = `LEFT JOIN ${join.joinedTable} as ${join.pseudonym} ON ${join.pseudonym}.${join.joinedField} = ${join.baseTable}.${join.baseField}`;
      });
    }

    if (field.type === "template") {
      const innerJoins = {};
      const innerParts = ["SELECT "];

      field.content.forEach((contentItem) => {
        addQueryByItem(contentItem, innerJoins, innerParts);
      });

      innerParts.push(` FROM orders as suborder`);

      Object.keys(innerJoins).forEach((key) => {
        innerParts.push(` ${innerJoins[key]}`);
      });

      innerParts.push(` WHERE orders.id = suborder.id`);

      if (field.conditions?.length) {
        field.conditions.forEach((cond) => {
          innerParts.push(
            ` AND ${swapSubOrdersTable(cond.baseTable)}.${cond.baseField} ${
              cond.joinCondition
            } ${swapSubOrdersTable(cond.joinedTable)}.${cond.joinedField}`
          );
        });
      }

      if (field.groups?.length) {
        innerParts.push(" GROUP BY ");
        field.groups.forEach((grp, gIdx) => {
          if (gIdx > 0) innerParts.push(", ");
          innerParts.push(
            `${swapSubOrdersTable(grp.baseTable)}.${grp.baseField}`
          );
        });
      }

      if (field.orders?.length) {
        innerParts.push(" ORDER BY ");
        field.orders.forEach((ord, oIdx) => {
          if (oIdx > 0) innerParts.push(", ");
          innerParts.push(
            `${swapSubOrdersTable(ord.baseTable)}.${ord.baseField}`
          );
        });
      }

      query += `(${innerParts.join("")}) AS ${field.pseudonym}`;
    }
  });

  query += ` FROM orders`;
  Object.keys(joins).forEach((key) => {
    query += ` ${joins[key]}`;
  });

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

export default FullQuery;
