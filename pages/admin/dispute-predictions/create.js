import { useAdminPage } from "../../../hooks";
import BreadCrumbs from "../../../partials/admin/base/BreadCrumbs";
import Header from "../../../partials/admin/Header";
import Sidebar from "../../../partials/admin/Sidebar";
import { getTableRelations } from "../../../services";
import { adminSideProps } from "../../../middlewares";
import { useState } from "react";
import { cloneObject } from "../../../utils";
import ModelParamTemplateModal from "../../../components/admin/DisputePrediction/ModelParamTemplateModal";
import ModelParamFieldModal from "../../../components/admin/DisputePrediction/ModelParamFieldModal";

const CreateDisputePrediction = ({ structure: tableStructure }) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const [modelParams, setModelParams] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [activeModelTemplateParam, setActiveModelTemplateParam] =
    useState(null);
  const [activeModelFieldParam, setActiveModelFieldParam] = useState(null);

  const handleSubmit = async () => {
    console.log(modelParams);
  };

  const updateModelParam = (index) => {
    if (modelParams[index]["type"] === "template") {
      setActiveModelTemplateParam({
        index,
        pseudonym: modelParams[index].pseudonym,
        content: cloneObject(modelParams[index].content),
        condition: {
          mainTable: modelParams[index].mainTable ?? null,
          mainField: modelParams[index].mainField ?? null,
          operation: modelParams[index].operation ?? null,
          subTable: modelParams[index].subTable ?? null,
          subField: modelParams[index].subField ?? null,
        },
      });
    }

    if (modelParams[index]["type"] === "field") {
      setActiveModelFieldParam({
        index,
        pseudonym: modelParams[index].pseudonym,
        tableName: modelParams[index].content.tableName,
        fieldName: modelParams[index].content.fieldName,
        connectTableName: modelParams[index].content.connectTableName,
        connectFieldName: modelParams[index].content.connectFieldName,
      });
    }
  };

  const createModelTemplateParam = () => {
    setActiveModelTemplateParam({
      pseudonym: "",
      content: [],
      condition: {
        mainTable: null,
        mainField: null,
        operation: null,
        subTable: null,
        subField: null,
      },
    });
  };

  const createModelFieldParam = () => {
    setActiveModelFieldParam({
      pseudonym: "",
      tableName: "",
      fieldName: "",
      connectTableName: "",
      connectFieldName: "",
    });
  };

  const saveModelParam = (param, index = null) => {
    if (index === null) {
      setModelParams((prev) => [...prev, param]);
      return;
    }

    setModelParams((prev) =>
      prev.map((prevModelParam, prevModelParamIndex) => {
        return prevModelParamIndex === index
          ? { ...prevModelParam, ...param }
          : prevModelParam;
      })
    );
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden dark:bg-slate-900">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow overflow-hidden">
          <div className="relative h-full">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto h-full flex flex-col justify-space-between overflow-hidden">
              <div className="md:flex md:justify-between md:items-center mb-8">
                <BreadCrumbs
                  links={[
                    {
                      title: "Dispute Predictions",
                      href: "/admin/dispute-predictions",
                    },
                    { title: "Create" },
                  ]}
                />
              </div>

              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm flex flex-col justify-space-between h-full overflow-hidden">
                <div className="overflow-auto max-h-full h-full gap-2 flex flex-col m-4 ">
                  {modelParams.map((param, index) => (
                    <div
                      className="p-4 rounded-xs border border-slate-200 cursor-pointer hover:bg-gray-100 transition duration-150 ease-in-out"
                      onClick={() => updateModelParam(index)}
                    >
                      {param.pseudonym}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row md:-mr-px">
                  <div className="grow w-full">
                    <footer>
                      <div className="flex flex-col px-6 py-5 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex self-end">
                          <button
                            onClick={createModelFieldParam}
                            className="btn bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            Add Field
                          </button>

                          <button
                            onClick={createModelTemplateParam}
                            className="btn bg-blue-500 hover:bg-blue-600 text-white ml-3"
                          >
                            Formula Builder
                          </button>

                          <button
                            disabled={disabled}
                            type="button"
                            onClick={handleSubmit}
                            className="btn bg-teal-500 hover:bg-teal-600 text-white ml-3"
                          >
                            Create Model
                          </button>
                        </div>
                      </div>
                    </footer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <ModelParamTemplateModal
        onSaveClick={saveModelParam}
        modalOpen={!!activeModelTemplateParam}
        closeModal={() => setActiveModelTemplateParam(null)}
        index={activeModelTemplateParam?.index ?? null}
        content={activeModelTemplateParam?.content ?? []}
        condition={activeModelTemplateParam?.condition ?? {}}
        pseudonym={activeModelTemplateParam?.pseudonym ?? ""}
        tableStructure={tableStructure}
      />

      <ModelParamFieldModal
        onSaveClick={saveModelParam}
        modalOpen={!!activeModelFieldParam}
        closeModal={() => setActiveModelFieldParam(null)}
        tableStructure={tableStructure}
        index={activeModelFieldParam?.index ?? null}
        pseudonym={activeModelFieldParam?.pseudonym ?? ""}
        fieldName={activeModelFieldParam?.fieldName ?? null}
        tableName={activeModelFieldParam?.tableName ?? null}
        connectFieldName={activeModelFieldParam?.connectFieldName ?? null}
        connectTableName={activeModelFieldParam?.connectTableName ?? null}
      />
    </div>
  );
};

const boostServerSideProps = async ({ baseSideProps }) => {
  const options = await getTableRelations(baseSideProps.authToken);
  return { ...options };
};

export const getServerSideProps = (context) =>
  adminSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "Create Dispute Prediction" },
  });

export default CreateDisputePrediction;
