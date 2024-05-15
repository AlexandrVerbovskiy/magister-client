import { useContext, useState } from "react";
import {
  useAdminPage,
  useChangeTimeFilter,
  useInitPaginationTimeFilter,
  usePagination,
} from "../../../hooks";
import { supportSideProps } from "../../../middlewares";
import {
  baseTimeListPageParams,
  getDateByCurrentAdd,
  getDateByCurrentReject,
} from "../../../utils";
import { IndiceContext } from "../../../contexts";
import PaginationNumeric from "../../../components/admin/PaginationNumeric";
import Datepicker from "../../../components/admin/Datepicker";
import SearchForm from "../../../partials/admin/actions/SearchForm";
import BreadCrumbs from "../../../partials/admin/base/BreadCrumbs";
import Sidebar from "../../../partials/admin/Sidebar";
import Header from "../../../partials/admin/Header";
import BookingsTable from "../../../components/admin/Bookings/Table";

import {
  deleteOrder,
  getAdminBookingList,
  getAdminBookingsListPageOptions,
} from "../../../services";
import DeleteAccept from "../../../components/admin/DeleteAccept";

const Bookings = (pageProps) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, success, authToken } = useContext(IndiceContext);
  const [toDeleteBookingInfo, setToDeleteBookingInfo] = useState({});
  const [dangerModalOpen, setDangerModalOpen] = useState(false);

  const { fromTime, setFromTime, toTime, setToTime, getTimeFilterProps } =
    useInitPaginationTimeFilter();

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
    getDopProps: getTimeFilterProps,
    defaultData: pageProps,
  });

  const { handleChangeTimeFilter } = useChangeTimeFilter({
    options,
    fromTime,
    setFromTime,
    toTime,
    setToTime,
    rebuild,
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

                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                  <SearchForm value={filter} onInput={changeFilter} />
                  <Datepicker
                    value={[fromTime, toTime]}
                    onChange={handleChangeTimeFilter}
                    placeholder="From start to end date"
                  />
                </div>
              </div>

              <BookingsTable
                bookings={bookings}
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
    baseTimeListPageParams(context.query),
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  supportSideProps(context, boostServerSideProps);

export default Bookings;
