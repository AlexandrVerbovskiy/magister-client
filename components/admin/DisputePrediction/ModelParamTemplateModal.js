import { useEffect, useState } from "react";
import ModalBlank from "../ModalBlank";
import { cloneObject } from "../../../utils";
import Builder from "./Builder";

const ModelParamTemplateModal = ({
  onSaveClick,
  modalOpen,
  closeModal,
  content: baseContent = [],
  pseudonym: basePseudonym = "",
  conditions: baseConditions = [],
  groups: baseGroups = [],
  comparisonType: baseComparisonType = null,
  tableStructure,
  defaultValue: baseDefaultValue = "",
}) => {
  const [content, setContent] = useState([]);
  const [pseudonym, setPseudonym] = useState("");
  const [pseudonymError, setPseudonymError] = useState(null);
  const [conditions, setConditions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [comparisonType, setComparisonType] = useState("numerical");
  const [defaultValue, setDefaultValue] = useState("");
  const [defaultValueError, setDefaultValueError] = useState("");

  useEffect(() => setContent(cloneObject(baseContent)), [baseContent]);

  useEffect(() => setPseudonym(basePseudonym), [basePseudonym]);

  useEffect(() => setConditions(cloneObject(baseConditions)), [baseConditions]);

  useEffect(() => setGroups(cloneObject(baseGroups)), [baseGroups]);

  useEffect(() => setDefaultValue(baseDefaultValue), [baseDefaultValue]);

  useEffect(
    () => setComparisonType(baseComparisonType ?? "numerical"),
    [baseComparisonType]
  );

  const handleSaveClick = () => {
    onSaveClick(
      cloneObject({
        pseudonym,
        type: "template",
        content: content,
        conditions: conditions,
        groups: groups,
        comparisonType,
        defaultValue,
      })
    );

    setContent([]);
    setPseudonym("");
    setConditions([]);
    setGroups([]);
    setDefaultValue("");

    closeModal();
  };

  return (
    <ModalBlank
      id="model-param-template-modal"
      modalOpen={modalOpen}
      setModalOpen={closeModal}
      className="bg-white dark:bg-slate-800 rounded shadow-lg overflow-hidden max-w-6xl w-full max-h-full"
      wrapperClassName="fixed inset-0 z-50 overflow-hidden flex my-4 justify-center px-4 sm:px-6"
    >
      <div className="p-5 flex space-x-4 w-full h-full">
        <div className="flex flex-col w-full justify-between h-full">
          <div className="flex flex-col w-full justify-between h-full mb-4 overflow-y-hidden">
            <div className="mb-2">
              <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Form Builder
              </div>
            </div>

            <div className="h-full overflow-y-hidden">
              <div className="flex flex-col h-full justify-between overflow-y-hidden">
                <Builder
                  tableStructure={tableStructure}
                  dopProps={{
                    content,
                    setContent,
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
                    defaultValue,
                    setDefaultValue,
                    defaultValueError,
                    setDefaultValueError,
                  }}
                />
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

export default ModelParamTemplateModal;
