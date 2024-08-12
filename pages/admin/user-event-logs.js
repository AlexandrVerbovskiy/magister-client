import React, { useContext, useState } from "react";
import Sidebar from "../../partials/admin/Sidebar";
import Header from "../../partials/admin/Header";
import BreadCrumbs from "../../partials/admin/base/BreadCrumbs";
import PaginationNumeric from "../../components/admin/PaginationNumeric";
import LogsTable from "../../components/admin/UserLogs/Table";
import { adminSideProps } from "../../middlewares";

import { useAdminPage, usePagination, useBaseAdminFilter } from "../../hooks";
import { IndiceContext } from "../../contexts";
import {
  getAdminUserEventLogListPageOptions,
  getUserEventLogList,
} from "../../services";
import { baseTimeTypePageParams } from "../../utils";
import BaseListSubHeader from "../../components/admin/BaseListSubHeader";

const Logs = (pageProps) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, authToken } = useContext(IndiceContext);
  const [typeCount, setTypeCount] = useState(pageProps.typeCount);

  const onRebuild = (data) => {
    setTypeCount(data.typeCount);
  };

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
    items: logs,
    rebuild,
    options,
    loading: paginationLoading,
  } = usePagination({
    getItemsFunc: (data) => getUserEventLogList(data, authToken),
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
                <BreadCrumbs links={[{ title: "Logs" }]} />
              </div>

              <BaseListSubHeader
                type={type}
                handleChangeType={handleChangeType}
                typeOptions={[
                  { value: "all", title: "All", count: typeCount["allCount"] },
                  {
                    title: "User Actions",
                    value: "user",
                    count: typeCount["userCount"],
                  },
                  {
                    title: "Admin Actions",
                    value: "admin",
                    count: typeCount["adminCount"],
                  },
                ]}
                filter={filter}
                filterPlaceholder="Search by Log Id"
                handleChangeFilter={changeFilter}
                timeFilterType={timeFilterType}
                handleChangeTimeFilterType={handleChangeTimeFilterType}
                rebuild={rebuild}
              />

              <LogsTable
                logs={logs}
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
    </div>
  );
};

const boostServerSideProps = async ({ context, baseSideProps }) => {
  const options = await getAdminUserEventLogListPageOptions(
    { ...baseTimeTypePageParams(context.query), type: context.query["type"] },
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  adminSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "User event logs" },
  });

export default Logs;
