import { useContext, useEffect, useState } from "react";
import {
  useAdminPage,
  useBaseAdminFilter,
  usePagination,
} from "../../../hooks";
import { supportSideProps } from "../../../middlewares";
import {
  baseAdminTimeListPageParams,
  baseTimeListPageParams,
} from "../../../utils";
import { IndiceContext } from "../../../contexts";
import PaginationNumeric from "../../../components/admin/PaginationNumeric";
import BreadCrumbs from "../../../partials/admin/base/BreadCrumbs";
import Sidebar from "../../../partials/admin/Sidebar";
import Header from "../../../partials/admin/Header";
import BookingsTable from "../../../components/admin/Orders/Table";

import {
  deleteOrder,
  getAdminBookingList,
  getAdminBookingsListPageOptions,
} from "../../../services";
import DeleteAccept from "../../../components/admin/DeleteAccept";
import BaseListSubHeader from "../../../components/admin/BaseListSubHeader";

const Bookings = (pageProps) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, success, authToken } = useContext(IndiceContext);
  const [toDeleteBookingInfo, setToDeleteBookingInfo] = useState({});
  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const [statusCount, setStatusCount] = useState(pageProps.statusCount);

  const {
    timeFilterType,
    getBaseAdminFilterDopProps,
    handleChangeTimeFilterType,
    type,
    handleChangeType,
  } = useBaseAdminFilter({props: pageProps});

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
    items: bookings,
    rebuild,
    options,
  } = usePagination({
    getItemsFunc: (data) => getAdminBookingList(data, authToken),
    onError: (e) => error.set(e.message),
    getDopProps: getBaseAdminFilterDopProps,
    defaultData: pageProps,
    onRebuild,
  });

  const handleCloseDeleteModal = () => {
    setToDeleteBookingInfo(null);
    setDangerModalOpen(false);
  };

  const handleOpenDeleteModal = (id) => {
    setToDeleteBookingInfo({ id });
    setDangerModalOpen(true);
  };

  const onDeleteAccept = async () => {
    try {
      const { id } = toDeleteBookingInfo;
      await deleteOrder(id, authToken);
      handleCloseDeleteModal();
      await rebuild();
      success.set(`Booking #${id} deleted successfully!`);
    } catch (e) {
      error.set(e.message);
    }
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden dark:bg-slate-900">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="relative">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className="sm:flex sm:justify-between sm:items-center mb-8">
                <BreadCrumbs links={[{ title: "Bookings" }]} />
              </div>

              <BaseListSubHeader
                type={type}
                handleChangeType={handleChangeType}
                typeOptions={[
                  {
                    value: "all",
                    title: "All",
                    count: statusCount["allCount"],
                  },
                  {
                    value: "accepted",
                    title: "Accepted",
                    count: statusCount["acceptedCount"],
                  },
                  {
                    value: "canceled",
                    title: "Canceled",
                    count: statusCount["canceledCount"],
                  },
                  {
                    value: "rejected",
                    title: "Rejected",
                    count: statusCount["rejectedCount"],
                  },
                ]}
                filter={filter}
                filterPlaceholder="Search by Booking Id"
                handleChangeFilter={changeFilter}
                timeFilterType={timeFilterType}
                handleChangeTimeFilterType={handleChangeTimeFilterType}
                rebuild={rebuild}
              />

              <BookingsTable
                orders={bookings}
                orderField={order}
                orderType={orderType}
                onClickTh={handleChangeOrder}
                totalCount={countItems}
                openDeleteModal={handleOpenDeleteModal}
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

      <DeleteAccept
        title="Delete booking?"
        body={`Are you sure you want to remove booking ${
          toDeleteBookingInfo?.id ?? ""
        } from the system? All information about him will be lost`}
        modalOpen={dangerModalOpen}
        setModalOpen={setDangerModalOpen}
        handleCloseDeleteModal={handleCloseDeleteModal}
        onDeleteAccept={onDeleteAccept}
      />
    </div>
  );
};

const boostServerSideProps = async ({ context, baseSideProps }) => {
  const options = await getAdminBookingsListPageOptions(
    {
      ...baseAdminTimeListPageParams(context.query),
      type: context.query["type"],
    },
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  supportSideProps(context, boostServerSideProps);

export default Bookings;
