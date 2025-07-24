import React, { useContext, useState } from "react";
import Sidebar from "../../../partials/admin/Sidebar";
import Header from "../../../partials/admin/Header";
import BreadCrumbs from "../../../partials/admin/base/BreadCrumbs";
import PaginationNumeric from "../../../components/admin/PaginationNumeric";
import DisputePredictionModelsTable from "../../../components/admin/DisputePrediction/Table";
import { adminSideProps } from "../../../middlewares";
import { useAdminPage, usePagination } from "../../../hooks";
import { IndiceContext } from "../../../contexts";
import {
  getAdminDisputePredictionModelListPageOptions,
  getDisputePredictionModelList,
  stopDisputePredictionModel,
  unstopDisputePredictionModel,
  activateDisputePredictionModel,
  startTrainingDisputePredictionModel,
} from "../../../services";
import { baseListPageParams } from "../../../utils";
import YesNoModal from "../../../components/admin/YesNoModal";
import Link from "next/link";
import ModalBlank from "../../../components/admin/ModalBlank";
import Switch from "../../../partials/admin/base/Switch";

const DisputePredictionModels = (pageProps) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, authToken } = useContext(IndiceContext);

  const [modelIdToStop, setModelIdToStop] = useState(null);
  const [modelIdToUnstop, setModelIdToUnstop] = useState(null);
  const [modelIdToActivate, setModelIdToActivate] = useState(null);
  const [modelIdToStartTraining, setModelIdToStartTraining] = useState(null);

  const [onActivateRebuild, setOnActivateRebuild] = useState(false);

  const {
    page,
    countItems,
    countPages,
    moveToPage,
    order,
    orderType,
    currentTo,
    currentFrom,
    handleChangeOrder,
    canMoveNextPage,
    canMovePrevPage,
    items: models,
    rebuild,
    loading: paginationLoading,
  } = usePagination({
    getItemsFunc: (data) => getDisputePredictionModelList(data, authToken),
    onError: (e) => error.set(e.message),
    defaultData: pageProps,
  });

  const onAcceptStopModel = async () => {
    await stopDisputePredictionModel(modelIdToStop, authToken);
    setModelIdToStop(null);
    rebuild();
  };

  const onAcceptUnstopModel = async () => {
    await unstopDisputePredictionModel(modelIdToUnstop, authToken);
    setModelIdToUnstop(null);
    rebuild();
  };

  const onAcceptActivateModel = async () => {
    await activateDisputePredictionModel(
      modelIdToActivate,
      onActivateRebuild,
      authToken
    );
    setModelIdToActivate(null);
    setOnActivateRebuild(false);
    rebuild();
  };

  const onStartTrainingModel = async () => {
    await startTrainingDisputePredictionModel(
      modelIdToStartTraining,
      authToken
    );
    setModelIdToStartTraining(null);
    rebuild();
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
                <BreadCrumbs links={[{ title: "Dispute Prediction Models" }]} />

                <div className="flex md:auto-cols-max justify-start md:justify-end gap-2 mt-2 md:mt-0 flex-col md:flex-row">
                  <div className="flex gap-2">
                    <Link
                      href="/admin/dispute-predictions/create/"
                      className="btn bg-teal-500 hover:bg-teal-600 text-white"
                    >
                      <svg
                        className="w-4 h-4 fill-current opacity-50 shrink-0"
                        viewBox="0 0 16 16"
                      >
                        <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                      </svg>
                      <span className="ml-2">Add Model</span>
                    </Link>
                  </div>
                </div>
              </div>

              <DisputePredictionModelsTable
                models={models}
                orderField={order}
                orderType={orderType}
                onClickTh={handleChangeOrder}
                totalCount={countItems}
                loading={paginationLoading}
                setModelIdToStop={setModelIdToStop}
                setModelIdToUnstop={setModelIdToUnstop}
                setModelIdToActivate={setModelIdToActivate}
                setModelIdToStartTraining={setModelIdToStartTraining}
              />

              <div className="mt-8">
                <PaginationNumeric
                  page={page}
                  countPages={countPages}
                  move={moveToPage}
                  canNext={canMoveNextPage}
                  canPrev={canMovePrevPage}
                  to={currentTo}
                  from={currentFrom}
                  totalCount={countItems}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      <YesNoModal
        title="Confirm action"
        active={!!modelIdToStop}
        closeModal={() => modelIdToStop(null)}
        body={`Are you sure you want to stop generating model #${modelIdToStop}?`}
        onAccept={onAcceptStopModel}
      />

      <YesNoModal
        title="Confirm action"
        active={!!modelIdToUnstop}
        closeModal={() => setModelIdToUnstop(null)}
        body={`Are you sure you want to continue generating model #${modelIdToUnstop}?`}
        onAccept={onAcceptUnstopModel}
      />

      <ModalBlank
        id="modelIdToActivate"
        modalOpen={!!modelIdToActivate}
        setModalOpen={() => setModelIdToActivate(null)}
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
                <p>
                  Are you sure you want to activate model #{modelIdToActivate}?
                </p>

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
                  setModelIdToActivate(null);
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
        title="Start training"
        active={!!modelIdToStartTraining}
        closeModal={() => setModelIdToStartTraining(null)}
        body={`Are you sure you want to start training model #${modelIdToUnstop}?`}
        onAccept={onStartTrainingModel}
      />
    </div>
  );
};

const boostServerSideProps = async ({ context, baseSideProps }) => {
  const options = await getAdminDisputePredictionModelListPageOptions(
    baseListPageParams(context.query),
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  adminSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "Dispute Prediction Models" },
  });

export default DisputePredictionModels;
