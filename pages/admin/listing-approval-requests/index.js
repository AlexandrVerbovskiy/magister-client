import React, { useContext, useState } from "react";
import Sidebar from "../../../partials/admin/Sidebar";
import Header from "../../../partials/admin/Header";
import BreadCrumbs from "../../../partials/admin/base/BreadCrumbs";
import PaginationNumeric from "../../../components/admin/PaginationNumeric";
import { adminSideProps } from "../../../middlewares";
import ListingApprovalRequestsTable from "../../../components/admin/ListingApprovalRequests/Table";

import {
  useAdminPage,
  usePagination,
  useBaseAdminFilter,
} from "../../../hooks";
import { IndiceContext } from "../../../contexts";
import {
  getAdminListingApprovalRequestListPageOptions,
  getAdminListingApprovalRequestsList,
} from "../../../services";
import { baseAdminTimeListPageParams } from "../../../utils";
import BaseListSubHeader from "../../../components/admin/BaseListSubHeader";

const UserVerifyRequests = (pageProps) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, authToken } = useContext(IndiceContext);
  const [status, setStatus] = useState(pageProps.status ?? "waiting");

  const {
    timeFilterType,
    getBaseAdminFilterDopProps,
    handleChangeTimeFilterType,
    type,
    handleChangeType,
  } = useBaseAdminFilter({ props: pageProps });

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
    setItemFields,
    loading: paginationLoading,
  } = usePagination({
    getItemsFunc: (data) =>
      getAdminListingApprovalRequestsList(data, authToken),
    onError: (e) => error.set(e.message),
    getDopProps: () => ({
      ...getBaseAdminFilterDopProps(),
      status: {
        value: status,
        hidden: (value) => value == "waiting",
      },
    }),
    defaultData: pageProps,
  });

  const handleChangeStatus = (status) => {
    setStatus(status);
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
              <div className="md:flex md:justify-between md:items-center mb-8">
                <BreadCrumbs links={[{ title: "Listing Approve Requests" }]} />

                <BaseListSubHeader
                  type={type}
                  handleChangeType={handleChangeType}
                  filter={filter}
                  filterPlaceholder="Search by Request Id"
                  handleChangeFilter={changeFilter}
                  timeFilterType={timeFilterType}
                  handleChangeTimeFilterType={handleChangeTimeFilterType}
                  rebuild={rebuild}
                  listFilters={[
                    {
                      name: "status",
                      label: "Status",
                      options: [
                        {
                          value: "waiting",
                          title: "Waiting",
                        },
                        {
                          value: "approved",
                          title: "Approved",
                        },
                        {
                          value: "rejected",
                          title: "Rejected",
                        },
                        { value: "all", title: "All" },
                      ],
                      value: status,
                      onChange: handleChangeStatus,
                    },
                  ]}
                  dopClass=""
                />
              </div>

              <ListingApprovalRequestsTable
                listingApprovalRequests={listingApprovalRequests}
                orderField={order}
                orderType={orderType}
                onClickTh={handleChangeOrder}
                totalCount={countItems}
                setItemFields={setItemFields}
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
    </div>
  );
};

const boostServerSideProps = async ({ context, baseSideProps }) => {
  const options = await getAdminListingApprovalRequestListPageOptions(
    {
      ...baseAdminTimeListPageParams(context.query),
      status: context.query["status"],
    },
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  adminSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "Listing approval requests" },
  });

export default UserVerifyRequests;
