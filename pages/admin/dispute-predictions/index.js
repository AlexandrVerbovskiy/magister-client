import React, { useContext, useState } from "react";
import Sidebar from "../../../partials/admin/Sidebar";
import Header from "../../../partials/admin/Header";
import BreadCrumbs from "../../../partials/admin/base/BreadCrumbs";
import PaginationNumeric from "../../../components/admin/PaginationNumeric";
import DisputePredictionModelsTable from "../../../components/admin/DisputePredictionModels/Table";
import { adminSideProps } from "../../../middlewares";
import { useAdminPage, usePagination } from "../../../hooks";
import { IndiceContext } from "../../../contexts";
import {
  getAdminDisputePredictionModelListPageOptions,
  getDisputePredictionModelList,
  stopDisputePredictionModel,
  unstopDisputePredictionModel,
  activateDisputePredictionModel,
} from "../../../services";
import { baseListPageParams } from "../../../utils";
import YesNoModal from "../../../components/admin/YesNoModal";

const DisputePredictionModels = (pageProps) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, authToken } = useContext(IndiceContext);

  const [modelIdToStop, setModelIdToStop] = useState(null);
  const [modelIdToUnstop, setModelIdToUnstop] = useState(null);
  const [modelIdToActivate, setModelIdToActivate] = useState(null);

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

  const onAcceptStopModel = async (id) => {
    await stopDisputePredictionModel(id, authToken);
    setModelIdToStop(null);
    rebuild();
  };

  const onAcceptUnstopModel = async (id) => {
    await unstopDisputePredictionModel(id, authToken);
    setModelIdToUnstop(null);
    rebuild();
  };

  const onAcceptActivateModel = async (id) => {
    await activateDisputePredictionModel(id, authToken);
    setModelIdToUnstop(null);
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

      <YesNoModal
        title="Confirm action"
        active={!!modelIdToActivate}
        closeModal={() => setModelIdToActivate(null)}
        body={`Are you sure you want to activate model #${modelIdToActivate}?`}
        onAccept={onAcceptActivateModel}
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
