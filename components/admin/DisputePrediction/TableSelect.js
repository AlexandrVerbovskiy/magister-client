import DropdownClassic from "../DropdownClassic";
import ErrorSpan from "../ErrorSpan";

const getTableRelations = ({ tableStructure, selectedTable, selectedField }) =>
  (tableStructure[selectedTable]?.["relations"] ?? []).filter(
    (relation) => relation.targetColumn == selectedField
  );

const getFieldRelations = ({
  tableStructure,
  selectedTable,
  selectedField,
  connectedTable,
}) =>
  (tableStructure[selectedTable]?.["relations"] ?? []).filter(
    (relation) =>
      relation.targetColumn == selectedField &&
      relation.sourceTable === connectedTable
  );

const TableSelect = ({
  tableStructure,

  tableName,
  setTableName,
  fieldName,
  setFieldName,
  connectTableName,
  setConnectTableName,
  connectFieldName,
  setConnectFieldName,

  tableNameError = null,
  setTableNameError = () => {},
  fieldNameError = null,
  setFieldNameError = () => {},
  connectTableNameError = null,
  setConnectTableNameError = () => {},
  connectFieldNameError = null,
  setConnectFieldNameError = () => {},
}) => {
  const handleChangeTableName = (newValue) => {
    setTableName(newValue);
    setTableNameError(null);
    setFieldName(null);
    setConnectFieldName(null);
    setConnectTableName(null);
  };

  const handleChangeFieldName = (newValue) => {
    setFieldName(newValue);
    setFieldNameError(null);

    const connectTables = getTableRelations({
      tableStructure,
      selectedTable: tableName,
      selectedField: newValue,
    });

    if (connectTables.length === 1) {
      setConnectFieldName(connectTables[0]["sourceColumn"]);
      setConnectTableName(connectTables[0]["sourceTable"]);
    } else {
      setConnectFieldName(null);
      setConnectTableName(null);
    }
  };

  const handleChangeConnectTableName = (newValue) => {
    setConnectTableName(newValue);
    setConnectTableNameError(null);
    const connectFields = getFieldRelations({
      tableStructure,
      selectedTable: tableName,
      selectedField: fieldName,
      connectedTable: newValue,
    });

    if (connectFields.length === 1) {
      setConnectFieldName(connectFields[0]["sourceColumn"]);
    } else {
      setConnectFieldName(null);
    }
  };

  const handleChangeConnectFieldName = (newValue) => {
    setConnectFieldName(newValue);
    setConnectFieldNameError(null);
  };

  const tableOptions = [
    {
      value: null,
      title: "Select table",
      default: true,
    },
    ...Object.keys(tableStructure).map((table) => ({
      value: table,
      title: table,
    })),
  ];

  const fieldOptions = [
    {
      value: null,
      title: "Select field",
      default: true,
    },
  ];

  if (tableName) {
    tableStructure[tableName]["fields"].forEach((field) => {
      fieldOptions.push({ value: field.columnName, title: field.columnName });
    });
  }

  const connectTableOptions = [
    {
      value: null,
      title: "Select table",
      default: true,
    },
  ];

  if (fieldName) {
    console.log(tableStructure[tableName]);

    getTableRelations({
      tableStructure,
      selectedTable: tableName,
      selectedField: fieldName,
    }).forEach((relation) => {
      connectTableOptions.push({
        value: relation.sourceTable,
        title: relation.sourceTable,
      });
    });
  }

  const connectFieldOptions = [
    {
      value: null,
      title: "Select field",
      default: true,
    },
  ];

  if (connectTableName) {
    getFieldRelations({
      tableStructure,
      selectedTable: tableName,
      selectedField: fieldName,
      connectedTable: connectTableName,
    }).forEach((relation) => {
      connectFieldOptions.push({
        value: relation.sourceColumn,
        title: relation.sourceColumn,
      });
    });
  }

  return (
    <>
      <div className="w-full mb-4 flex gap-2">
        <div className="w-full sm:w-[calc(100%-4px)]">
          <label className="block text-sm font-medium mb-1">Table Name</label>
          <DropdownClassic
            selected={tableName}
            setSelected={handleChangeTableName}
            needSearch={true}
            options={tableOptions}
          />
          <ErrorSpan error={tableNameError} />
        </div>

        <div className="w-full sm:w-[calc(100%-4px)]">
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
      </div>

      <div className="w-full mb-4 flex gap-2">
        <div className="w-full sm:w-[calc(100%-4px)]">
          <label className="block text-sm font-medium mb-1">
            Connection Table Name
          </label>
          <DropdownClassic
            selected={connectTableName}
            setSelected={handleChangeConnectTableName}
            needSearch={true}
            dropdownDisabled={!fieldName || connectTableOptions.length < 3}
            options={connectTableOptions}
          />
          <ErrorSpan error={connectTableNameError} />
        </div>

        <div className="w-full sm:w-[calc(100%-4px)]">
          <label className="block text-sm font-medium mb-1">
            Connection field name
          </label>
          <DropdownClassic
            selected={connectFieldName}
            setSelected={handleChangeConnectFieldName}
            needSearch={true}
            dropdownDisabled={
              !connectTableName || connectFieldOptions.length < 3
            }
            options={connectFieldOptions}
          />
          <ErrorSpan error={connectFieldNameError} />
        </div>
      </div>
    </>
  );
};

export default TableSelect;
