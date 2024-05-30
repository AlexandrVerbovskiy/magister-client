import React, { useContext, useState } from "react";
import Sidebar from "../../../partials/admin/Sidebar";
import Header from "../../../partials/admin/Header";
import BreadCrumbs from "../../../partials/admin/base/BreadCrumbs";
import SearchForm from "../../../partials/admin/actions/SearchForm";
import PaginationNumeric from "../../../components/admin/PaginationNumeric";
import Datepicker from "../../../components/admin/Datepicker";
import { adminSideProps } from "../../../middlewares";
import ListingApprovalRequests from "../../../components/admin/ListingApprovalRequests/Table";
import FilterRadioOption from "../../../components/admin/Form/FilterRadioOption";

import {
  useAdminPage,
  usePagination,
  useInitPaginationTimeFilter,
  useChangeTimeFilter,
  useTimeTypeFilter,
} from "../../../hooks";
import { IndiceContext } from "../../../contexts";
import {
  getAdminListingApprovalRequestListPageOptions,
  getAdminListingApprovalRequestsList,
} from "../../../services";
import { useRouter } from "next/router";
import DropdownFilter from "../../../components/admin/DropdownFilter";
import {
  baseAdminTimeListPageParams,
  baseTimeListPageParams,
} from "../../../utils";
import DateSelect from "../../../components/admin/DateSelect";

const UserVerifyRequests = (pageProps) => {
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, success, authToken } = useContext(IndiceContext);

  /*const baseStatusFilter = router.query.status ?? "all";
  const [statusFilter, setStatusFilter] = useState(baseStatusFilter);*/

  const { timeFilterType, geTimeTypeDopProps, handleChangeTimeFilterType } =
    useTimeTypeFilter(pageProps);

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
    items: listingApprovalRequests,
    rebuild,
    options,
  } = usePagination({
    getItemsFunc: (data) =>
      getAdminListingApprovalRequestsList(data, authToken),
    onError: (e) => error.set(e.message),
    getDopProps: geTimeTypeDopProps,
    defaultData: pageProps,
  });

  const handleChangeStatusFilter = (status) => {
    setStatusFilter(status);
    rebuild({ status: status });
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
                <BreadCrumbs links={[{ title: "Listing Approve Requests" }]} />

                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                  <SearchForm value={filter} onInput={changeFilter} />
                  <DateSelect
                    value={timeFilterType}
                    setValue={(value) =>
                      handleChangeTimeFilterType(value, rebuild)
                    }
                  />
                </div>
              </div>

              <ListingApprovalRequests
                listingApprovalRequests={listingApprovalRequests}
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
  const options = await getAdminListingApprovalRequestListPageOptions(
    baseAdminTimeListPageParams(context.query),
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  adminSideProps(context, boostServerSideProps);

export default UserVerifyRequests;
