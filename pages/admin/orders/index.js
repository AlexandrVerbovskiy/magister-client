import { useContext, useState } from "react";
import {
  useAdminPage,
  useBaseAdminFilter,
  usePagination,
} from "../../../hooks";
import { supportSideProps } from "../../../middlewares";
import { baseAdminTimeListPageParams } from "../../../utils";
import { IndiceContext } from "../../../contexts";
import PaginationNumeric from "../../../components/admin/PaginationNumeric";
import OrdersTable from "../../../components/admin/Orders/Table";
import BreadCrumbs from "../../../partials/admin/base/BreadCrumbs";
import Sidebar from "../../../partials/admin/Sidebar";
import Header from "../../../partials/admin/Header";
import {
  deleteOrder,
  getAdminOrderList,
  getAdminOrderListPageOptions,
} from "../../../services";
import BaseListSubHeader from "../../../components/admin/BaseListSubHeader";

const Orders = (pageProps) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, authToken } = useContext(IndiceContext);
  const [statusCount, setStatusCount] = useState(pageProps.statusCount);

  const {
    timeFilterType,
    getBaseAdminFilterDopProps,
    handleChangeTimeFilterType,
    type,
    handleChangeType,
  } = useBaseAdminFilter({ props: pageProps });

  const onRebuild = (data) => {
    setStatusCount(data.statusCount);
  };

  const {
    page,
    countItems,
    countPages,
    moveToPage,
    filter,
    changeFilter,
    order,
    orderType,
    currentTo,
    currentFrom,
    handleChangeOrder,
    canMoveNextPage,
    canMovePrevPage,
    items: orders,
    rebuild,
    loading: paginationLoading,
  } = usePagination({
    getItemsFunc: (data) => getAdminOrderList(data, authToken),
    onError: (e) => error.set(e.message),
    getDopProps: getBaseAdminFilterDopProps,
    defaultData: pageProps,
    onRebuild,
  });

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden dark:bg-slate-900">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="relative">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className="mb-8">
                <BreadCrumbs links={[{ title: "Rentals" }]} />
              </div>

              <BaseListSubHeader
                type={type}
                handleChangeType={handleChangeType}
                typeOptions={[
                  {
                    value: "active",
                    title: "Active",
                    count: statusCount["activeCount"],
                  },
                  {
                    value: "finished",
                    title: "Finished",
                    count: statusCount["finishedCount"],
                  },
                  {
                    value: "canceled",
                    title: "Canceled",
                    count: statusCount["canceledCount"],
                  },
                  {
                    value: "in-dispute",
                    title: "In dispute",
                    count: statusCount["disputeCount"],
                  },
                  {
                    value: "all",
                    title: "All",
                    count: statusCount["allCount"],
                  },
                ]}
                filter={filter}
                filterPlaceholder="Search by Rental Id"
                handleChangeFilter={changeFilter}
                timeFilterType={timeFilterType}
                handleChangeTimeFilterType={handleChangeTimeFilterType}
                rebuild={rebuild}
              />

              <OrdersTable
                orders={orders}
                orderField={order}
                orderType={orderType}
                onClickTh={handleChangeOrder}
                totalCount={countItems}
                loading={paginationLoading}
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

      {/*<DeleteAccept
        title="Delete order?"
        body={`Are you sure you want to remove order ${
          toDeleteOrderInfo?.id ?? ""
        } from the system? All information about him (including payment information) will be lost`}
        modalOpen={dangerModalOpen}
        setModalOpen={setDangerModalOpen}
        handleCloseDeleteModal={handleCloseDeleteModal}
        onDeleteAccept={onDeleteAccept}
      />*/}
    </div>
  );
};

const boostServerSideProps = async ({ context, baseSideProps }) => {
  const options = await getAdminOrderListPageOptions(
    {
      ...baseAdminTimeListPageParams(context.query),
      type: context.query["type"],
    },
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  supportSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "Orders" },
  });

export default Orders;
