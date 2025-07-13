import { useState } from "react";
import DropdownClassic from "../DropdownClassic";
import ErrorSpan from "../ErrorSpan";
import Input from "../Form/Input";
import ModalBlank from "../ModalBlank";

const TableSelect = ({
  tableStructure,

  joins,
  setJoins,
  tableName,
  setTableName,
  fieldName,
  setFieldName,

  tableNameError = null,
  setTableNameError = () => {},
  fieldNameError = null,
  setFieldNameError = () => {},
}) => {
  const [activeJoin, setActiveJoin] = useState(null);

  const handleChangeTableName = (newValue) => {
    setTableName(newValue);
    setTableNameError(null);
    setFieldName(null);
  };

  const handleChangeFieldName = (newValue) => {
    setFieldName(newValue);
    setFieldNameError(null);
  };

  const getTableNameOnBaseTable = (table) => {
    const joinRes = joins.find(
      (join) => join.joinedTable === table || join.pseudonym === table
    );

    return joinRes?.joinedTable || table;
  };

  const tableOptions = [
    {
      value: null,
      title: "Select table",
      default: true,
    },
    ...Array.from(
      new Set([...joins.map((join) => join.pseudonym), "orders"])
    ).map((pseudonym) => ({
      value: pseudonym,
      title: pseudonym,
    })),
  ];

  const fieldOptions = [
    {
      value: null,
      title: "Select field",
      default: true,
    },
  ];

  if (tableName && tableStructure[getTableNameOnBaseTable(tableName)]) {
    tableStructure[getTableNameOnBaseTable(tableName)]["fields"].forEach(
      (field) => {
        fieldOptions.push({ value: field.columnName, title: field.columnName });
      }
    );
  }

  const activeBaseTableOptions = [
    {
      value: null,
      title: "Select table",
      default: true,
    },
  ];

  if (activeJoin) {
    Array.from(
      new Set([
        ...joins
          .filter((join, joinIndex) => activeJoin.index !== joinIndex)
          .map((join) => join.pseudonym),
        "orders",
      ])
    ).forEach((pseudonym) =>
      activeBaseTableOptions.push({
        value: pseudonym,
        title: pseudonym,
      })
    );
  }

  const activeBaseFieldOptions = [
    {
      value: null,
      title: "Select field",
      default: true,
    },
  ];

  if (
    activeJoin?.baseTable &&
    tableStructure[getTableNameOnBaseTable(activeJoin?.baseTable)]
  ) {
    tableStructure[getTableNameOnBaseTable(activeJoin?.baseTable)][
      "fields"
    ].forEach((field) => {
      activeBaseFieldOptions.push({
        value: field.columnName,
        title: field.columnName,
      });
    });
  }

  const activeJoinTableOptions = [
    {
      value: null,
      title: "Select table",
      default: true,
    },
  ];

  let checkedTables = [];

  [
    ...joins.map((join) => ({
      connectedTable: join.connectedTable,
      pseudonym: join.pseudonym,
    })),
    {
      connectedTable: getTableNameOnBaseTable(activeJoin?.baseTable),
      pseudonym: activeJoin?.baseTable,
    },
  ].forEach((join) => {
    if (
      checkedTables.includes(join.connectedTable) ||
      !tableStructure[join.connectedTable]
    ) {
      return;
    }

    tableStructure[join.connectedTable]["relations"].forEach((relation) => {
      if (relation.targetColumn === activeJoin?.baseField) {
        activeJoinTableOptions.push({
          value: relation.sourceTable,
          title: relation.sourceTable,
        });
      }
    });

    Object.keys(tableStructure).forEach((tableName) => {
      if (tableStructure[tableName]["relations"]) {
        tableStructure[tableName]["relations"].forEach((relation) => {
          if (
            relation.sourceTable ===
              getTableNameOnBaseTable(activeJoin?.baseTable) &&
            relation.sourceColumn === activeJoin?.baseField
          ) {
            activeJoinTableOptions.push({
              value: tableName,
              title: tableName,
              joinedField: relation.targetColumn,
            });
          }
        });
      }
    });
  });

  const handleSaveCondition = () => {
    if (!activeJoin) return;

    const newJoin = {
      baseTable: activeJoin.baseTable,
      baseField: activeJoin.baseField,
      joinedTable: activeJoin.joinedTable,
      joinedField: activeJoin.joinedField,
      pseudonym: activeJoin.pseudonym,
    };

    setJoins((prev) => {
      const updatedJoins = [...prev];
      if (activeJoin.index !== undefined) {
        updatedJoins[activeJoin.index] = newJoin;
      } else {
        updatedJoins.push(newJoin);
      }
      return updatedJoins;
    });

    setActiveJoin(null);
  };

  const onSelectConnectedTable = (newValue) => {
    if (!activeJoin) return;

    const option = activeJoinTableOptions.find(
      (join) => join.value === newValue
    );

    setActiveJoin({
      ...activeJoin,
      joinedTable: newValue,
      joinedField: option.joinedField,
    });
  };

  return (
    <>
      <div className="w-full gap-2 mb-4">
        {joins.map((join, index) => (
          <div
            key={index}
            className="border border-slate-200 w-full px-3 py-2 cursor-pointer rounded-md mb-4"
            onClick={() => setActiveJoin({ ...join, index })}
          >
            {join.pseudonym || "-"}
          </div>
        ))}
      </div>

      <div className="w-full mb-4 flex gap-2">
        <div className="w-full sm:w-[calc((100%-90px)/2)]">
          <label className="block text-sm font-medium mb-1">
            Table Name
          </label>
          <DropdownClassic
            selected={tableName}
            setSelected={handleChangeTableName}
            needSearch={true}
            options={tableOptions}
          />
          <ErrorSpan error={tableNameError} />
        </div>

        <div className="w-full sm:w-[calc((100%-90px)/2)]">
          <label className="block text-sm font-medium mb-1">Field Name</label>
          <DropdownClassic
            selected={fieldName}
            setSelected={handleChangeFieldName}
            needSearch={true}
            dropdownDisabled={!tableName}
            options={fieldOptions}
          />
          <ErrorSpan error={fieldNameError} />
        </div>

        <div className="w-[90px] flex items-end">
          <button
            onClick={() =>
              setJoins((prev) => [
                ...prev,
                {
                  baseTable: null,
                  joinTable: null,
                  baseField: null,
                  joinedField: null,
                  pseudonym: "",
                },
              ])
            }
            className="btn bg-teal-500 hover:bg-teal-600 text-white"
          >
            Add Join
          </button>
        </div>
      </div>

      <ModalBlank
        modalOpen={!!activeJoin}
        setModalOpen={() => setActiveJoin(null)}
      >
        <div className="p-5 flex flex-col">
          <div className="w-full">
            <div className="mb-4">
              <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                <span>Join Details</span>
              </div>
            </div>

            <div
              className="text-sm mb-4 w-full flex flex-col space-y-4"
              style={{ overflow: "auto", height: "400px" }}
            >
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Condition Main Table
                </label>
                <DropdownClassic
                  selected={activeJoin?.baseTable}
                  setSelected={(newValue) =>
                    setActiveJoin({
                      ...activeJoin,
                      baseTable: newValue,
                    })
                  }
                  needSearch={true}
                  options={activeBaseTableOptions}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Condition Main Field
                </label>
                <DropdownClassic
                  selected={activeJoin?.baseField}
                  setSelected={(newValue) =>
                    setActiveJoin({
                      ...activeJoin,
                      baseField: newValue,
                    })
                  }
                  needSearch={true}
                  options={activeBaseFieldOptions}
                  dropdownDisabled={!activeJoin?.baseTable}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Condition Join Table
                </label>
                <DropdownClassic
                  selected={activeJoin?.joinedTable}
                  setSelected={onSelectConnectedTable}
                  needSearch={true}
                  options={activeJoinTableOptions}
                  dropdownDisabled={!activeJoin?.baseField}
                />
              </div>

              <div className="w-full mb-4">
                <Input
                  name="field-pseudonym"
                  value={activeJoin?.pseudonym ?? ""}
                  setValue={(newValue) =>
                    setActiveJoin({
                      ...activeJoin,
                      pseudonym: newValue,
                    })
                  }
                  label="Field Pseudonym"
                  placeholder="Enter Field Pseudonym"
                  labelClassName="block text-sm font-semibold mb-1"
                  inputClassName="form-input w-full"
                />
              </div>
            </div>
          </div>

          <div className="w-full flex flex-wrap justify-end space-x-2">
            <button
              type="button"
              onClick={() => setActiveJoin(null)}
              className="btn border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSaveCondition}
              className="btn bg-teal-500 hover:bg-teal-600 text-white ml-3"
            >
              Save
            </button>
          </div>
        </div>
      </ModalBlank>
    </>
  );
};

export default TableSelect;
