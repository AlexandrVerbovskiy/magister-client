import { useAdminPage } from "../../../hooks";
import BreadCrumbs from "../../../partials/admin/base/BreadCrumbs";
import Header from "../../../partials/admin/Header";
import Sidebar from "../../../partials/admin/Sidebar";
import { getTableRelations } from "../../../services";
import { adminSideProps } from "../../../middlewares";
import { useState } from "react";
import { cloneObject } from "../../../utils";
import ModelParamModal from "../../../components/admin/DisputePrediction/ModelParamModal";

const CreateDisputePrediction = (pageProps) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const [modelParams, setModelParams] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [activeModelParam, setActiveModelParam] = useState(null);

  const handleSubmit = async () => {
    console.log(modelParams);
  };

  const updateModelParam = (index) => {
    modelParams[index];
    setActiveModelParam({
      index,
      fieldName: modelParams[index].fieldName,
      content: cloneObject(modelParams[index].content),
    });
  };

  const createModelParam = () => {
    setActiveModelParam({ fieldName: "", content: [] });
  };

  const saveModelParam = (param, index = null) => {
    if (index === null) {
      setModelParams((prev) => [...prev, param]);
      return;
    }

    setModelParams((prev) => {
      prev.map((prevModelParam, prevModelParamIndex) => {
        return prevModelParamIndex === index ? param : prevModelParam;
      });
    });
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden dark:bg-slate-900">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="relative">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
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

              <div className="mt-8"></div>

              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
                <div className="flex flex-col md:flex-row md:-mr-px">
                  <div className="grow w-full">
                    <footer>
                      <div className="flex flex-col px-6 py-5 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex self-end">
                          <button
                            onClick={createModelParam}
                            className="btn bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            Add New Param
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

      <ModelParamModal
        onSaveClick={saveModelParam}
        modalOpen={!!activeModelParam}
        closeModal={() => setActiveModelParam(null)}
        index={activeModelParam?.index ?? null}
        content={activeModelParam?.content ?? []}
        fieldName={activeModelParam?.fieldName ?? ""}
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
