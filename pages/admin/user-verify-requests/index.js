import React, { useContext } from "react";
import Sidebar from "../../../partials/admin/Sidebar";
import Header from "../../../partials/admin/Header";
import BreadCrumbs from "../../../partials/admin/base/BreadCrumbs";
import SearchForm from "../../../partials/admin/actions/SearchForm";
import PaginationNumeric from "../../../components/admin/PaginationNumeric";
import Datepicker from "../../../components/admin/Datepicker";
import UserVerifyRequestsTable from "../../../components/admin/UserVerifyRequests/Table";
import { supportSideProps } from "../../../middlewares";

import {
  useAdminPage,
  usePagination,
  useInitPaginationTimeFilter,
  useChangeTimeFilter,
} from "../../../hooks";
import { IndiceContext } from "../../../contexts";
import {
  getAdminUserUserVerifyRequestListPageOptions,
  getUserVerifyRequestList,
} from "../../../services";
import { baseTimeListPageParams } from "../../../utils";

const UserVerifyRequests = (pageProps) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, success, authToken } = useContext(IndiceContext);

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
    items: userVerifyRequests,
    rebuild,
    options,
  } = usePagination({
    getItemsFunc: (data) => getUserVerifyRequestList(data, authToken),
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

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden dark:bg-slate-900">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="relative">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className="sm:flex sm:justify-between sm:items-center mb-8">
                <BreadCrumbs links={[{ title: "User Verify Requests" }]} />

                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                  <Datepicker
                    value={[fromTime, toTime]}
                    onChange={handleChangeTimeFilter}
                    placeholder="Filter by sent time"
                  />
                  <SearchForm value={filter} onInput={changeFilter} />
                </div>
              </div>

              <UserVerifyRequestsTable
                userVerifyRequests={userVerifyRequests}
                orderField={order}
                orderType={orderType}
                onClickTh={handleChangeOrder}
                totalCount={countItems}
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
    </div>
  );
};

const boostServerSideProps = async ({ context, baseSideProps }) => {
  const options = await getAdminUserUserVerifyRequestListPageOptions(
    baseTimeListPageParams(context.query),
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  supportSideProps(context, boostServerSideProps);

export default UserVerifyRequests;
