import Input from "../Form/Input";
import ModalBlank from "../ModalBlank";
import { useEffect, useState } from "react";
import { cloneObject, validateSmallText } from "../../../utils";
import TableSelect from "./TableSelect";
import _ from "lodash";
import DropdownClassic from "../DropdownClassic";

const ModelParamFieldModal = ({
  onSaveClick,
  modalOpen,
  closeModal,
  tableStructure,
  pseudonym: basePseudonym = "",
  fieldName: baseFieldName = null,
  tableName: baseTableName = null,
  comparisonType: baseComparisonType = null,
  needComparisonType = true,
  joins: baseJoins = [],
  defaultValue: baseDefaultValue = "",
}) => {
  const [comparisonType, setComparisonType] = useState("numerical");
  const [pseudonym, setPseudonym] = useState("");
  const [pseudonymError, setPseudonymError] = useState(null);
  const [tableName, setTableName] = useState(null);
  const [tableNameError, setTableNameError] = useState(null);
  const [fieldName, setFieldName] = useState(null);
  const [fieldNameError, setFieldNameError] = useState(null);
  const [defaultValue, setDefaultValue] = useState("");
  const [defaultValueError, setDefaultValueError] = useState(null);
  const [joins, setJoins] = useState([]);

  useEffect(() => setPseudonym(basePseudonym), [basePseudonym]);

  useEffect(() => setTableName(baseTableName), [baseTableName]);

  useEffect(() => setFieldName(baseFieldName), [baseFieldName]);

  useEffect(() => setDefaultValue(baseDefaultValue), [baseDefaultValue]);

  useEffect(
    () => setComparisonType(baseComparisonType ?? "numerical"),
    [baseComparisonType]
  );

  useEffect(() => {
    if (!_.isEqual(baseJoins, joins)) {
      setJoins(baseJoins);
    }
  }, [baseJoins]);

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

    const data = {
      pseudonym,
      tableName,
      fieldName,
      joins: cloneObject(joins),
      defaultValue,
    };

    if (needComparisonType) {
      data["comparisonType"] = comparisonType;
    }

    onSaveClick(data);

    setPseudonym("");
    setTableName(null);
    setFieldName(null);
    setJoins([]);
    setComparisonType("numerical");
    setDefaultValue("");

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
                  joins={joins}
                  setJoins={setJoins}
                  tableNameError={tableNameError}
                  setTableNameError={setTableNameError}
                  fieldNameError={fieldNameError}
                  setFieldNameError={setFieldNameError}
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

                <div className="w-full mb-4">
                  <Input
                    name="default-value"
                    value={defaultValue}
                    setValue={setDefaultValue}
                    error={defaultValueError}
                    setError={setDefaultValueError}
                    label="Default Value"
                    placeholder="Enter Value"
                    labelClassName="block text-sm font-medium mb-1"
                    inputClassName="form-input w-full"
                  />
                </div>

                {comparisonType && (
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
                          title: "Numerical field",
                        },
                        {
                          value: "categorical",
                          title: "Categorical field",
                        },
                      ]}
                    />
                  </div>
                )}
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
