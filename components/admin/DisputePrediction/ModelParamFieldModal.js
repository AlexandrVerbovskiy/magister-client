import Input from "../Form/Input";
import ModalBlank from "../ModalBlank";
import DropdownClassic from "../DropdownClassic";
import ErrorSpan from "../ErrorSpan";
import { useEffect, useState } from "react";
import { validateSmallText } from "../../../utils";

const getTableRelations = ({ tableStructure, selectedTable, selectedField }) =>
  tableStructure[selectedTable]["relations"].filter(
    (relation) => relation.targetColumn == selectedField
  );

const getFieldRelations = ({
  tableStructure,
  selectedTable,
  selectedField,
  connectedTable,
}) =>
  tableStructure[selectedTable]["relations"].filter(
    (relation) =>
      relation.targetColumn == selectedField &&
      relation.sourceTable === connectedTable
  );

const ModelParamFieldModal = ({
  onSaveClick,
  modalOpen,
  closeModal,
  tableStructure,
  index = null,
  pseudonym: basePseudonym = "",
  fieldName: baseFieldName = null,
  tableName: baseTableName = null,
  connectFieldName: baseConnectFieldName = null,
  connectTableName: baseConnectTableName = null,
}) => {
  const [pseudonym, setPseudonym] = useState("");
  const [pseudonymError, setPseudonymError] = useState(null);

  const [tableName, setTableName] = useState(null);
  const [tableNameError, setTableNameError] = useState(null);

  const [fieldName, setFieldName] = useState(null);
  const [fieldNameError, setFieldNameError] = useState(null);

  const [connectTableName, setConnectTableName] = useState(null);
  const [connectTableNameError, setConnectTableNameError] = useState(null);

  const [connectFieldName, setConnectFieldName] = useState(null);
  const [connectFieldNameError, setConnectFieldNameError] = useState(null);

  useEffect(() => setPseudonym(basePseudonym), [basePseudonym]);

  useEffect(() => setTableName(baseTableName), [baseTableName]);

  useEffect(() => setFieldName(baseFieldName), [baseFieldName]);

  useEffect(
    () => setConnectFieldName(baseConnectFieldName),
    [baseConnectFieldName]
  );

  useEffect(
    () => setConnectTableName(baseConnectTableName),
    [baseConnectTableName]
  );

  const handleSaveClick = () => {
    let hasError = false;

    if (!fieldName) {
      setFieldNameError("Required Field");
      hasError = true;
    }

    if (!tableName) {
      setTableNameError("Required Field");
      hasError = true;
    }

    if (!connectTableName) {
      setConnectTableNameError("Required Field");
      hasError = true;
    }

    if (!connectFieldName) {
      setConnectFieldNameError("Required Field");
      hasError = true;
    }

    if (pseudonym) {
      let resPseudonymValidation = validateSmallText(pseudonym);

      if (resPseudonymValidation !== true) {
        setPseudonymError(resPseudonymValidation);
        hasError = true;
      }
    } else {
      setPseudonymError("Required Field");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    onSaveClick(
      {
        pseudonym,
        type: "field",
        content: {
          tableName,
          fieldName,
          connectTableName,
          connectFieldName,
        },
      },
      index
    );

    closeModal();
  };

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
      title: "Select field",
      default: true,
    },
  ];

  if (fieldName) {
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
    <ModalBlank
      id="model--field-modal"
      modalOpen={modalOpen}
      setModalOpen={closeModal}
      className="bg-white dark:bg-slate-800 rounded shadow-lg max-w-lg w-full max-h-full"
    >
      <div className="p-5 flex space-x-4 w-full h-full">
        <div className="flex flex-col w-full justify-between h-full">
          <div className="flex flex-col w-full justify-between h-full mb-4">
            <div className="mb-2">
              <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Field Manager
              </div>
            </div>

            <div className="h-full">
              <div className="flex flex-col h-full justify-between">
                <div className="w-full mb-4 flex gap-2">
                  <div className="w-full sm:w-[calc(100%-4px)]">
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

                  <div className="w-full sm:w-[calc(100%-4px)]">
                    <label className="block text-sm font-medium mb-1">
                      Field Name
                    </label>
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
                      dropdownDisabled={
                        !fieldName || connectTableOptions.length < 3
                      }
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

                <div className="w-full mb-4">
                  <Input
                    name="field-pseudonym"
                    value={pseudonym}
                    setValue={setPseudonym}
                    error={pseudonymError}
                    setError={setPseudonymError}
                    label="Field Pseudonym (for visual distinction)"
                    placeholder="Enter Field Pseudonym"
                    labelClassName="block text-sm font-medium mb-1"
                    inputClassName="form-input w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-end space-x-2">
            <button
              className="btn border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveClick}
              className="btn bg-teal-500 hover:bg-teal-600 text-white"
            >
              Save It
            </button>
          </div>
        </div>
      </div>
    </ModalBlank>
  );
};

export default ModelParamFieldModal;
