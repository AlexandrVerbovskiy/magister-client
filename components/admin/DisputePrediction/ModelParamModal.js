import { useEffect, useState } from "react";
import ModalBlank from "../ModalBlank";
import Input from "../Form/Input";
import { cloneObject } from "../../../utils";
import Builder from "./Builder";

const ModelParamModal = ({
  onSaveClick,
  modalOpen,
  closeModal,
  index = null,
  content: baseContent = [],
  fieldName: baseFieldName = "",
}) => {
  const [content, setContent] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [fieldNameError, setFieldNameError] = useState(null);

  useEffect(() => setContent(cloneObject(baseContent)), [baseContent]);

  useEffect(() => setFieldName(baseFieldName), [baseFieldName]);

  const handleSaveClick = () => {
    onSaveClick({ fieldName, content }, index);
  };

  return (
    <ModalBlank
      id="model-param-modal"
      modalOpen={modalOpen}
      setModalOpen={closeModal}
      className="bg-white dark:bg-slate-800 rounded shadow-lg overflow-hidden max-w-6xl w-full max-h-full"
      wrapperClassName="fixed inset-0 z-50 overflow-hidden flex my-4 justify-center px-4 sm:px-6"
    >
      <div className="p-5 flex space-x-4 w-full h-full">
        {/* Content */}
        <div className="flex flex-col w-full justify-between h-full">
          <div className="flex flex-col w-full justify-between h-full mb-4 overflow-y-hidden">
            {/* Modal header */}
            <div className="mb-2">
              <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Model Param Management
              </div>
            </div>
            {/* Modal content */}
            <div className="h-full overflow-y-hidden">
              <div className="flex flex-col h-full justify-between overflow-y-hidden">
                <div className="w-full mb-4">
                  <Input
                    name="field-name"
                    value={fieldName}
                    setValue={setFieldName}
                    error={fieldNameError}
                    setError={setFieldNameError}
                    label="Field Name (for visual distinction)"
                    placeholder="Enter Field Name"
                    labelClassName="block text-sm font-medium mb-1"
                    inputClassName="form-input w-full"
                  />
                </div>

                <Builder />
              </div>
            </div>
          </div>
          {/* Modal footer */}
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

export default ModelParamModal;
