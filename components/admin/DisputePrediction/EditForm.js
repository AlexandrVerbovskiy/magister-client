import { useAdminPage } from "../../../hooks";
import BreadCrumbs from "../../../partials/admin/base/BreadCrumbs";
import Header from "../../../partials/admin/Header";
import Sidebar from "../../../partials/admin/Sidebar";
import {
  createDisputePredictionModel,
  updateDisputePredictionModel,
} from "../../../services";
import { useContext, useState } from "react";
import { cloneObject } from "../../../utils";
import ModelParamTemplateModal from "../../../components/admin/DisputePrediction/ModelParamTemplateModal";
import ModelParamFieldModal from "../../../components/admin/DisputePrediction/ModelParamFieldModal";
import FullQuery from "../../../components/admin/DisputePrediction/FullQuery";
import Switch from "../../../partials/admin/base/Switch";
import { IndiceContext } from "../../../contexts";
import { useRouter } from "next/router";
import DropdownClassic from "../DropdownClassic";

const EditForm = ({ structure: tableStructure, base, setBase }) => {
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { authToken, success, error } = useContext(IndiceContext);
  const [modelParams, setModelParams] = useState(base?.body ?? []);
  const [checkField, setCheckField] = useState(base?.checkField ?? "");
  const [disabled, setDisabled] = useState(false);

  const [afterFinishActive, setAfterFinishActive] = useState(
    base?.afterFinishActive ?? false
  );
  const [afterFinishRebuild, setAfterFinishRebuild] = useState(
    base?.afterFinishRebuild ?? false
  );

  const [activeModelTemplateParam, setActiveModelTemplateParam] =
    useState(null);
  const [activeModelFieldParam, setActiveModelFieldParam] = useState(null);

  const handleSubmit = async () => {
    try {
      if (base?.id) {
        const res = await updateDisputePredictionModel(
          {
            id: base?.id,
            body: modelParams,
            afterFinishActive,
            afterFinishRebuild,
            checkField,
          },
          authToken
        );

        setBase(res);
      } else {
        const res = await createDisputePredictionModel(
          {
            body: modelParams,
            afterFinishActive,
            afterFinishRebuild,
            checkField,
          },
          authToken
        );

        const newLinkPart =
          window.location.origin + "/admin/dispute-predictions/edit/" + res.id;
        router.replace(newLinkPart, undefined, { shallow: true });

        setBase(res);
      }

      success.set("Model Saved Success");
    } catch (e) {
      error.set(e.message);
    }
  };

  const updateModelParam = (index) => {
    if (modelParams[index]["type"] === "template") {
      setActiveModelTemplateParam({
        index,
        pseudonym: modelParams[index].pseudonym,
        content: cloneObject(modelParams[index].content),
        conditions: modelParams[index].conditions,
        groups: modelParams[index].groups,
        comparisonType: modelParams[index].comparisonType,
      });
    }

    if (modelParams[index]["type"] === "field") {
      setActiveModelFieldParam({
        index,
        pseudonym: modelParams[index].pseudonym,
        tableName: modelParams[index].content.tableName,
        fieldName: modelParams[index].content.fieldName,
        joins: modelParams[index].content.joins,
        comparisonType: modelParams[index].comparisonType,
      });
    }
  };

  const createModelTemplateParam = () => {
    setActiveModelTemplateParam({
      pseudonym: "",
      content: [],
      conditions: [],
      groups: [],
      comparisonType: "numerical",
    });
  };

  const createModelFieldParam = () => {
    setActiveModelFieldParam({
      pseudonym: "",
      joins: [],
      tableName: "orders",
      fieldName: "",
      comparisonType: "numerical",
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

  console.log(modelParams, checkField);

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

                <div className="p-6 space-y-6">
                  <section>
                    <div className="w-full mb-4">
                      <label className="block text-sm font-semibold mb-1">
                        Target Field
                      </label>
                      <DropdownClassic
                        name="target-field"
                        selected={checkField}
                        setSelected={setCheckField}
                        needSearch={false}
                        options={[
                          {
                            value: "",
                            title: "Not Selected",
                          },
                          ...modelParams.map((param) => ({
                            value: param.pseudonym,
                            title: param.pseudonym,
                          })),
                        ]}
                      />
                    </div>
                  </section>

                  {!base?.finished && (
                    <>
                      <section>
                        <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                          Active after finish
                        </h2>
                        <div className="flex flex-wrap mt-2">
                          <div className="mr-2">
                            <label
                              className="block text-sm font-medium mb-1"
                              htmlFor="after_finish"
                            ></label>
                          </div>
                          <Switch
                            id="after_finish"
                            checked={afterFinishActive}
                            changeChecked={() =>
                              setAfterFinishActive(!afterFinishActive)
                            }
                            onText="Active"
                            offText="Inactive"
                          />
                        </div>
                      </section>

                      <section>
                        <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                          Rebuild after finish
                        </h2>
                        <div className="flex flex-wrap mt-2">
                          <div className="mr-2">
                            <label
                              className="block text-sm font-medium mb-1"
                              htmlFor="after_finish_rebuild"
                            ></label>
                          </div>
                          <Switch
                            id="after_finish_rebuild"
                            checked={afterFinishRebuild}
                            changeChecked={() =>
                              setAfterFinishRebuild(!afterFinishRebuild)
                            }
                            onText="Yes"
                            offText="Not"
                          />
                        </div>
                      </section>
                    </>
                  )}
                </div>

                <div className="p-6 space-y-6">
                  <FullQuery modelParams={modelParams}/>
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
                            {base?.id ? "Update Model" : "Create Model"}
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
        onSaveClick={({
          comparisonType,
          pseudonym,
          content,
          conditions,
          groups,
        }) =>
          saveModelParam(
            {
              pseudonym,
              type: "template",
              content,
              conditions,
              groups,
              comparisonType,
            },
            activeModelTemplateParam?.index
          )
        }
        modalOpen={!!activeModelTemplateParam}
        closeModal={() => setActiveModelTemplateParam(null)}
        index={activeModelTemplateParam?.index ?? null}
        content={activeModelTemplateParam?.content ?? []}
        conditions={activeModelTemplateParam?.conditions ?? []}
        groups={activeModelTemplateParam?.groups ?? []}
        comparisonType={activeModelTemplateParam?.comparisonType ?? null}
        pseudonym={activeModelTemplateParam?.pseudonym ?? ""}
        tableStructure={tableStructure}
      />

      <ModelParamFieldModal
        onSaveClick={({
          comparisonType,
          tableName,
          fieldName,
          joins,
          pseudonym,
        }) =>
          saveModelParam(
            {
              pseudonym,
              type: "field",
              comparisonType,
              content: {
                tableName,
                fieldName,
                joins,
              },
            },
            activeModelFieldParam?.index
          )
        }
        modalOpen={!!activeModelFieldParam}
        closeModal={() => setActiveModelFieldParam(null)}
        tableStructure={tableStructure}
        index={activeModelFieldParam?.index ?? null}
        pseudonym={activeModelFieldParam?.pseudonym ?? ""}
        fieldName={activeModelFieldParam?.fieldName ?? null}
        tableName={activeModelFieldParam?.tableName ?? null}
        comparisonType={activeModelFieldParam?.comparisonType ?? null}
        joins={activeModelFieldParam?.joins ?? []}
      />
    </div>
  );
};

export default EditForm;
