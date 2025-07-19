import { cloneObject } from "../../../utils";
import DropdownClassic from "../DropdownClassic";
import Input from "../Form/Input";
import { useState } from "react";
import ModalBlank from "../ModalBlank";
import STATIC from "../../../static";

const Where = ({
  items,
  tableStructure,

  pseudonym,
  setPseudonym,
  pseudonymError,
  setPseudonymError,

  conditions,
  setConditions,

  groups,
  setGroups,

  comparisonType,
  setComparisonType,
}) => {
  const [activeConditionTable, setActiveConditionTable] = useState(null);
  const [activeGroupTable, setActiveGroupTable] = useState(null);

  const joins = [];

  const fillItemsJoins = (items) => {
    items.forEach((item) => {
      if (item.subItems) {
        fillItemsJoins(item.subItems);
      }

      if (
        item.key === STATIC.DISPUTE_PREDICTION_BLOCK.CUSTOM.TABLE_SELECTS.key
      ) {
        item.content.joins.forEach((join) => {
          if (
            !joins.map((subJoin) => subJoin.pseudonym).includes(join.pseudonym)
          ) {
            joins.push(join);
          }
        });
      }
    });
  };

  fillItemsJoins(items);

  const operationOptions = [
    {
      value: null,
      title: "Select operation",
    },
    ...[">", "<", "=", "!=", ">=", "<="].map((operation) => ({
      value: operation,
      title: operation,
    })),
  ];

  const getTableNameOnBaseTable = (table) => {
    const getTableName = (localItems) => {
      localItems.forEach((item) => {
        if (item.subItems) {
          getTableName(item.subItems);
        }

        if (!item.content?.joins) {
          return;
        }

        item.content.joins.forEach((join) => {
          if (join.joinedTable === table || join.pseudonym === table) {
            res = join.joinedTable;
          }
        });
      });
    };

    let res = table;
    getTableName(items);
    return res;
  };

  const joinedTablesPseudonyms = joins.map((c) => c.pseudonym);

  const allowedTables = Array.from(
    new Set([...joinedTablesPseudonyms, "orders"])
  );

  const mainTableOptions = [
    {
      value: null,
      title: "Select table",
      default: true,
    },
    ...allowedTables.map((table) => ({
      value: table,
      title: table,
    })),
  ];

  const subTableOptions = cloneObject(mainTableOptions);

  const whereMainFieldOptions = [
    {
      value: null,
      title: "Select field",
      default: true,
    },
  ];

  if (
    activeConditionTable?.baseTable &&
    tableStructure[getTableNameOnBaseTable(activeConditionTable.baseTable)]
  ) {
    tableStructure[getTableNameOnBaseTable(activeConditionTable.baseTable)][
      "fields"
    ].forEach((field) => {
      whereMainFieldOptions.push({
        value: field.columnName,
        title: field.columnName,
      });
    });
  }

  const groupMainFieldOptions = [
    {
      value: null,
      title: "Select field",
      default: true,
    },
  ];

  if (
    activeGroupTable?.baseTable &&
    tableStructure[getTableNameOnBaseTable(activeGroupTable.baseTable)]
  ) {
    tableStructure[getTableNameOnBaseTable(activeGroupTable.baseTable)][
      "fields"
    ].forEach((field) => {
      groupMainFieldOptions.push({
        value: field.columnName,
        title: field.columnName,
      });
    });
  }

  const subFieldOptions = [
    {
      value: null,
      title: "Select field",
      default: true,
    },
  ];

  if (
    activeConditionTable?.joinedTable &&
    tableStructure[getTableNameOnBaseTable(activeConditionTable.joinedTable)]
  ) {
    tableStructure[getTableNameOnBaseTable(activeConditionTable.joinedTable)][
      "fields"
    ].forEach((field) => {
      subFieldOptions.push({
        value: field.columnName,
        title: field.columnName,
      });
    });
  }

  const handleSaveCondition = () => {
    if (!activeConditionTable) return;

    const newConditions = [...conditions];
    newConditions[activeConditionTable.index] = {
      baseTable: activeConditionTable.baseTable,
      baseField: activeConditionTable.baseField,
      joinCondition: activeConditionTable.joinCondition,
      joinedTable: activeConditionTable.joinedTable,
      joinedField: activeConditionTable.joinedField,
    };

    setConditions(newConditions);
    setActiveConditionTable(null);
  };

  const handleAddCondition = () => {
    setConditions((prev) => [
      ...prev,
      {
        baseTable: null,
        baseField: null,
        joinCondition: null,
        joinedTable: null,
        joinedField: null,
      },
    ]);
  };

  const handleSaveGroup = () => {
    if (!activeGroupTable) return;

    const newGroups = [...groups];
    newGroups[activeGroupTable.index] = {
      baseTable: activeGroupTable.baseTable,
      baseField: activeGroupTable.baseField,
    };

    setGroups(newGroups);
    setActiveGroupTable(null);
  };

  const handleAddGroup = () => {
    setGroups((prev) => [
      ...prev,
      {
        baseTable: null,
        baseField: null,
      },
    ]);
  };

  const handleDeleteCondition = (index) => {
    setConditions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteGroup = (index) => {
    setGroups((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-2/12 border border-slate-200 px-3 py-2 text-sm leading-5 text-slate-800 shadow-sm h-full overflow-y-auto overflow-x-hidden">
      <div className="w-full mb-4">
        <Input
          name="field-pseudonym"
          value={pseudonym}
          setValue={setPseudonym}
          error={pseudonymError}
          setError={setPseudonymError}
          label="Field Pseudonym"
          placeholder="Enter Field Pseudonym"
          labelClassName="block text-sm font-semibold mb-1"
          inputClassName="form-input w-full"
        />
      </div>

      <div className="w-full mb-4">
        <label className="block text-sm font-semibold mb-1">
          Comparison Type
        </label>
        <DropdownClassic
          name="field-type"
          selected={comparisonType}
          setSelected={setComparisonType}
          needSearch={false}
          options={[
            {
              value: "numerical",
              title: "Numerical",
            },
            {
              value: "categorical",
              title: "Categorical",
            },
          ]}
        />
      </div>

      <div className="w-full mb-4">
        <label className="block text-sm font-semibold mb-1">Where</label>

        {conditions.map((condition, index) => (
          <div className="w-full mb-4 flex justify-between">
            <div
              className="w-[calc(100%-20px)] border border-slate-200 px-3 py-2 cursor-pointer overflow-hidden truncate"
              onClick={() => setActiveConditionTable({ ...condition, index })}
            >
              {condition.baseTable ?? "-"}.{condition.baseField ?? "-"}{" "}
              {condition.joinCondition ?? "-"} {condition.joinedTable ?? "-"}.
              {condition.joinedField ?? "-"}
            </div>

            <div className="ms-2 flex justify-between w-[20px]">
              <button
                onClick={() => handleDeleteCondition(index)}
                className="btn p-0 text-sm text-gray-500 hover:text-gray-400 disabled:bg-gray-300"
              >
                x
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="w-full btn bg-blue-500 hover:bg-blue-400 text-white"
          onClick={handleAddCondition}
        >
          Add Condition
        </button>
      </div>

      <div className="w-full mb-4">
        <label className="block text-sm font-semibold mb-1">Group By</label>

        {groups.map((group, index) => (
          <div className="w-full mb-4 flex justify-between">
            <div
              className="w-[calc(100%-20px)] border border-slate-200 px-3 py-2 cursor-pointer overflow-hidden truncate"
              onClick={() => setActiveGroupTable({ ...group, index })}
            >
              {group.baseTable ?? "-"}.{group.baseField ?? "-"}
            </div>

            <div className="ms-2 flex justify-between w-[20px]">
              <button
                onClick={() => handleDeleteGroup(index)}
                className="btn p-0 text-sm text-gray-500 hover:text-gray-400 disabled:bg-gray-300"
              >
                x
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="w-full btn bg-blue-500 hover:bg-blue-400 text-white"
          onClick={handleAddGroup}
        >
          Add Group
        </button>
      </div>

      <ModalBlank
        modalOpen={!!activeConditionTable}
        setModalOpen={() => setActiveConditionTable(null)}
      >
        <div className="p-5 flex space-x-4">
          <div className="w-full">
            <div className="mb-4">
              <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                <span>Where Condition</span>
              </div>
            </div>
            <div
              className="text-sm mb-4"
              style={{ overflow: "auto", height: "400px" }}
            >
              <div className="w-full mb-4">
                <label className="block text-sm font-semibold mb-1">
                  Condition Main Table
                </label>
                <DropdownClassic
                  selected={activeConditionTable?.baseTable}
                  setSelected={(newValue) =>
                    setActiveConditionTable({
                      ...activeConditionTable,
                      baseTable: newValue,
                    })
                  }
                  needSearch={true}
                  options={mainTableOptions}
                  dropdownDisabled={activeConditionTable?.disabled}
                />
              </div>

              <div className="w-full mb-4">
                <label className="block text-sm font-semibold mb-1">
                  Condition Main Field
                </label>
                <DropdownClassic
                  selected={activeConditionTable?.baseField}
                  setSelected={(newValue) =>
                    setActiveConditionTable({
                      ...activeConditionTable,
                      baseField: newValue,
                    })
                  }
                  needSearch={true}
                  options={whereMainFieldOptions}
                  dropdownDisabled={!activeConditionTable?.baseTable}
                />
              </div>

              <div className="w-full mb-4">
                <label className="block text-sm font-semibold mb-1">
                  Condition
                </label>
                <DropdownClassic
                  selected={activeConditionTable?.joinCondition}
                  setSelected={(newValue) =>
                    setActiveConditionTable({
                      ...activeConditionTable,
                      joinCondition: newValue,
                    })
                  }
                  needSearch={true}
                  options={operationOptions}
                />
              </div>

              <div className="w-full mb-4">
                <label className="block text-sm font-semibold mb-1">
                  Condition Sub Table
                </label>
                <DropdownClassic
                  selected={activeConditionTable?.joinedTable}
                  setSelected={(newValue) =>
                    setActiveConditionTable({
                      ...activeConditionTable,
                      joinedTable: newValue,
                    })
                  }
                  needSearch={true}
                  options={subTableOptions}
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-semibold mb-1">
                  Condition Sub Field
                </label>
                <DropdownClassic
                  selected={activeConditionTable?.joinedField}
                  setSelected={(newValue) =>
                    setActiveConditionTable({
                      ...activeConditionTable,
                      joinedField: newValue,
                    })
                  }
                  needSearch={true}
                  options={subFieldOptions}
                  dropdownDisabled={!activeConditionTable?.joinedTable}
                />
              </div>
            </div>

            <div className="w-full flex flex-wrap justify-end space-x-2">
              <button
                type="button"
                onClick={() => setActiveConditionTable(null)}
                className="btn border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSaveCondition}
                className="btn border-blue-200 hover:border-blue-300 text-blue-600 dark:text-blue-300"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </ModalBlank>

      <ModalBlank
        modalOpen={!!activeGroupTable}
        setModalOpen={() => setActiveGroupTable(null)}
      >
        <div className="p-5 flex space-x-4">
          <div className="w-full">
            <div className="mb-4">
              <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                <span>Group By</span>
              </div>
            </div>
            <div className="text-sm mb-4" style={{ overflow: "auto" }}>
              <div className="w-full mb-4">
                <label className="block text-sm font-semibold mb-1">
                  Group Main Table
                </label>
                <DropdownClassic
                  selected={activeGroupTable?.baseTable}
                  setSelected={(newValue) =>
                    setActiveGroupTable({
                      ...activeGroupTable,
                      baseTable: newValue,
                    })
                  }
                  needSearch={true}
                  options={mainTableOptions}
                  dropdownDisabled={activeGroupTable?.disabled}
                />
              </div>

              <div className="w-full mb-4">
                <label className="block text-sm font-semibold mb-1">
                  Group Main Field
                </label>
                <DropdownClassic
                  selected={activeGroupTable?.baseField}
                  setSelected={(newValue) =>
                    setActiveGroupTable({
                      ...activeGroupTable,
                      baseField: newValue,
                    })
                  }
                  needSearch={true}
                  options={groupMainFieldOptions}
                  dropdownDisabled={!activeGroupTable?.baseTable}
                />
              </div>
            </div>

            <div className="w-full flex flex-wrap justify-end space-x-2">
              <button
                type="button"
                onClick={() => setActiveGroupTable(null)}
                className="btn border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSaveGroup}
                className="btn border-blue-200 hover:border-blue-300 text-blue-600 dark:text-blue-300"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </ModalBlank>
    </div>
  );
};

export default Where;
