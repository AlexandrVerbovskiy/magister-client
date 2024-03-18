import React, { useState, useContext, useEffect } from "react";
import Sidebar from "../../partials/admin/Sidebar";
import Header from "../../partials/admin/Header";
import BreadCrumbs from "../../partials/admin/base/BreadCrumbs";
import SearchForm from "../../partials/admin/actions/SearchForm";
import PaginationNumeric from "../../components/admin/PaginationNumeric";
import TransactionPanel from "../../partials/admin/finance/Panel";
import LogsTable from "../../components/admin/Logs/Table";
import Datepicker from "../../components/admin/Datepicker";
import { adminSideProps } from "../../middlewares";

import {
  useAdminPage,
  usePagination,
  useChangeTimeFilter,
  useInitPaginationTimeFilter,
} from "../../hooks";
import { IndiceContext } from "../../contexts";
import { getAdminLogListPageOptions, getLogList } from "../../services";

const Logs = (pageProps) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, success, authToken } = useContext(IndiceContext);
  const [panelItem, setPanelItem] = useState(false);

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
    items: logs,
    rebuild,
    options,
  } = usePagination({
    getItemsFunc: (data) => getLogList(data, authToken),
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

  const handleSelectPanelItem = (id) =>
    setPanelItem(logs.find((log) => log.id === id));

  const handlePanelItemClear = () => setPanelItem(null);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden dark:bg-slate-900">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="relative">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className="sm:flex sm:justify-between sm:items-center mb-8">
                <BreadCrumbs links={[{ title: "Logs" }]} />

                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                  <Datepicker
                    value={[fromTime, toTime]}
                    onChange={handleChangeTimeFilter}
                  />
                  <SearchForm value={filter} onInput={changeFilter} />
                </div>
              </div>

              <LogsTable
                logs={logs}
                orderField={order}
                orderType={orderType}
                onClickTh={handleChangeOrder}
                totalCount={countItems}
                onSelectPanelItem={handleSelectPanelItem}
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

            <TransactionPanel
              panelItem={panelItem}
              handlePanelItemClear={handlePanelItemClear}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

const boostServerSideProps = async ({ context, baseSideProps }) => {
  const options = await getAdminLogListPageOptions(
    { ...context.query, clientTime: Date.now() },
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  adminSideProps(context, boostServerSideProps);

export default Logs;
