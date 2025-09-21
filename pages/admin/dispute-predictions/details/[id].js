import {
  activateDisputePredictionModel,
  getDisputePredictionModelDetails,
  startTrainingDisputePredictionModel,
  stopDisputePredictionModel,
  unstopDisputePredictionModel,
} from "../../../../services";
import { adminSideProps } from "../../../../middlewares";
import Header from "../../../../partials/admin/Header";
import Sidebar from "../../../../partials/admin/Sidebar";
import BreadCrumbs from "../../../../partials/admin/base/BreadCrumbs";
import { useAdminPage } from "../../../../hooks";
import YesNoModal from "../../../../components/admin/YesNoModal";
import ModalBlank from "../../../../components/admin/ModalBlank";
import { useContext, useState } from "react";
import { IndiceContext } from "../../../../contexts";
import { useRouter } from "next/router";
import Switch from "../../../../partials/admin/base/Switch";

const DisputePredictionDetails = ({ model }) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { authToken } = useContext(IndiceContext);
  const fields = (model.body ?? []).filter(
    (field) => field.pseudonym !== model.checkField
  );
  const router = useRouter();

  const [modelToStopActive, setModelToStopActive] = useState(false);
  const [modelToUnstopActive, setModelToUnstopActive] = useState(false);
  const [modelToActivateActive, setModelToActivateActive] = useState(false);
  const [modelToStartTrainingActive, setModelToStartTrainingActive] =
    useState(false);
  const [onActivateRebuild, setOnActivateRebuild] = useState(false);
  const [selectedFields, setSelectedFields] = useState(
    model.selectedFields ?? []
  );

  const handleFieldChange = (field) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const onAcceptStopModel = async () => {
    await stopDisputePredictionModel(model.id, authToken);
    setModelToStopActive(false);
    router.reload();
  };

  const onAcceptUnstopModel = async () => {
    await unstopDisputePredictionModel(model.id, authToken);
    setModelToUnstopActive(false);
    router.reload();
  };

  const onAcceptActivateModel = async () => {
    await activateDisputePredictionModel(
      model.id,
      onActivateRebuild,
      authToken
    );
    setModelToActivateActive(false);
    setOnActivateRebuild(false);
    router.reload();
  };

  const onStartTrainingModel = async () => {
    await startTrainingDisputePredictionModel(
      model.id,
      selectedFields,
      authToken
    );
    setModelToStartTrainingActive(false);
    router.reload();
  };

  const getNumericalView = (value) => {
    if (value === undefined || value === null) return "-";
    return value.toFixed(4);
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden dark:bg-slate-900">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="relative h-full">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto h-full flex flex-col justify-space-between">
              <div className="md:flex md:justify-between md:items-center mb-8">
                <BreadCrumbs
                  links={[
                    {
                      title: "Dispute Predictions",
                      href: "/admin/dispute-predictions",
                    },
                    { title: "Details" },
                  ]}
                />
              </div>

              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm flex flex-col justify-space-between">
                <div className="m-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {fields.map((field) => (
                      <div
                        key={field.pseudonym}
                        className="flex flex-col items-center bg-gray-50 dark:bg-slate-700 rounded-lg p-4 shadow"
                      >
                        <img
                          src={`${process.env.NEXT_PUBLIC_FOREST_API_URL}/images/${model.id}/${field.pseudonym}.png`}
                          alt={field.pseudonym}
                          className="w-full h-48 object-contain mb-2 rounded"
                        />
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          <label className="flex items-center gap-2 mb-1">
                            <input
                              type="checkbox"
                              checked={selectedFields.includes(field.pseudonym)}
                              onChange={() =>
                                handleFieldChange(field.pseudonym)
                              }
                              className="form-checkbox text-teal-500"
                            />

                            <>
                              {field.comparisonType === "numerical"
                                ? `Correlation matrix for ${
                                    field.pseudonym
                                  }: ${getNumericalView(
                                    model.predictionDetails?.correlation_dict?.[
                                      field.pseudonym
                                    ]
                                  )}`
                                : `Chi2 result for ${
                                    field.pseudonym
                                  }: ${getNumericalView(
                                    model.predictionDetails?.chi2_dict?.[
                                      field.pseudonym
                                    ]
                                  )}`}
                            </>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {((model.finished && !model.active) ||
                  (!model.finished && model.started && !model.stopped) ||
                  (!model.finished && model.started && model.stopped) ||
                  (!model.finished && !model.started && model.checked)) && (
                  <div className="flex flex-col px-6 py-5 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex flex-wrap gap-2 self-end">
                      {model.finished && !model.active && (
                        <button
                          type="button"
                          onClick={() => setModelToActivateActive(true)}
                          className="btn bg-teal-500 hover:bg-teal-600 text-white ml-3"
                        >
                          Activate
                        </button>
                      )}
                      {!model.finished && model.started && !model.stopped && (
                        <button
                          type="button"
                          onClick={() => setModelToStopActive(true)}
                          className="btn bg-rose-500 hover:bg-rose-600 text-white ml-3"
                        >
                          Stop
                        </button>
                      )}
                      {!model.finished && model.started && model.stopped && (
                        <button
                          type="button"
                          onClick={() => setModelToUnstopActive(true)}
                          className="btn bg-teal-500 hover:bg-teal-600 text-white ml-3"
                        >
                          Continue
                        </button>
                      )}
                      {!model.finished && !model.started && model.checked && (
                        <button
                          type="button"
                          onClick={() => setModelToStartTrainingActive(true)}
                          className="btn bg-teal-500 hover:bg-teal-600 text-white ml-3"
                        >
                          Start Training
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <YesNoModal
        title="Confirm action"
        modalOpen={modelToStopActive}
        handleCloseModal={() => setModelToStopActive(null)}
        body={`Are you sure you want to stop generating model #${model.id}?`}
        onAccept={onAcceptStopModel}
      />
      <YesNoModal
        type="success"
        title="Confirm action"
        modalOpen={!!modelToUnstopActive}
        handleCloseModal={() => setModelToUnstopActive(null)}
        body={`Are you sure you want to continue generating model #${model.id}?`}
        onAccept={onAcceptUnstopModel}
      />
      <ModalBlank
        id="modelToActivateActive"
        modalOpen={!!modelToActivateActive}
        setModalOpen={() => setModelToActivateActive(null)}
      >
        <div className="p-5 flex space-x-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-green-100 dark:bg-green-500/30">
            <svg
              className="w-4 h-4 shrink-0 fill-current text-green-500"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
            </svg>
          </div>
          <div className="w-full">
            <div className="mb-2">
              <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Confirm action
              </div>
            </div>
            <div className="text-sm mb-2">
              <div className="space-y-2">
                <p>Are you sure you want to activate model #{model.id}?</p>
                <Switch
                  id="after_finish"
                  checked={onActivateRebuild}
                  changeChecked={() => setOnActivateRebuild(!onActivateRebuild)}
                  onText="Rebuild"
                  offText="No Rebuild"
                />
              </div>
            </div>
            <div className="flex flex-wrap justify-end space-x-2">
              <button
                className="btn border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setModelToActivateActive(null);
                }}
              >
                No
              </button>
              <button
                onClick={onAcceptActivateModel}
                className="btn bg-green-500 hover:bg-green-600 text-white"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </ModalBlank>
      <YesNoModal
        type="success"
        title="Start training"
        modalOpen={modelToStartTrainingActive}
        handleCloseModal={() => setModelToStartTrainingActive(null)}
        body={`Are you sure you want to start training model #${model.id}?`}
        onAccept={onStartTrainingModel}
      />
    </div>
  );
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const id = context.params.id;
  const options = await getDisputePredictionModelDetails(
    id,
    baseSideProps.authToken
  );
  return { ...options, pageTitle: `Details #${id}` };
};

export const getServerSideProps = (context) =>
  adminSideProps({
    context,
    callback: boostServerSideProps,
  });

export default DisputePredictionDetails;
