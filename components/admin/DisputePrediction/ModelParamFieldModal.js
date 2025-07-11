import Input from "../Form/Input";
import ModalBlank from "../ModalBlank";
import { useEffect, useState } from "react";
import { validateSmallText } from "../../../utils";
import TableSelect from "./TableSelect";

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
                <TableSelect
                  tableStructure={tableStructure}
                  tableName={tableName}
                  setTableName={setTableName}
                  fieldName={fieldName}
                  setFieldName={setFieldName}
                  connectTableName={connectTableName}
                  setConnectTableName={setConnectTableName}
                  connectFieldName={connectFieldName}
                  setConnectFieldName={setConnectFieldName}
                  tableNameError={tableNameError}
                  setTableNameError={setTableNameError}
                  fieldNameError={fieldNameError}
                  setFieldNameError={setFieldNameError}
                  connectTableNameError={connectTableNameError}
                  setConnectTableNameError={setConnectTableNameError}
                  connectFieldNameError={connectFieldNameError}
                  setConnectFieldNameError={setConnectFieldNameError}
                />

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
