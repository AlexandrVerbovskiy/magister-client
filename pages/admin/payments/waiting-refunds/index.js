import { useContext, useState } from "react";
import { IndiceContext } from "../../../../contexts";
import { useAdminPage, usePagination } from "../../../../hooks";
import {
  getAdminWaitingRefundsList,
  getAdminWaitingRefundsRecipientPaymentListOptions,
} from "../../../../services";
import SearchForm from "../../../../partials/admin/actions/SearchForm";
import Sidebar from "../../../../partials/admin/Sidebar";
import Header from "../../../../partials/admin/Header";
import BreadCrumbs from "../../../../partials/admin/base/BreadCrumbs";
import PaginationNumeric from "../../../../components/admin/PaginationNumeric";
import { baseTimeListPageParams } from "../../../../utils";
import { adminSideProps } from "../../../../middlewares";
import WaitingRefundsTable from "../../../../components/admin/WaitingRefunds/Table";

const WaitingRefunds = (pageProps) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, success, authToken } = useContext(IndiceContext);

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
    items: payments,
    rebuild,
    options,
  } = usePagination({
    getItemsFunc: (data) => getAdminWaitingRefundsList(data, authToken),
    onError: (e) => error.set(e.message),
    defaultData: pageProps,
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
                <BreadCrumbs links={[{ title: "Recipient Payments" }]} />
                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                  <SearchForm value={filter} onInput={changeFilter} />
                </div>
              </div>

              <WaitingRefundsTable
                payments={payments}
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
  const type = context.query.type ?? "all";
  const status = context.query.status ?? "all";

  const params = { ...baseTimeListPageParams(context.query), status, type };

  const options = await getAdminWaitingRefundsRecipientPaymentListOptions(
    params,
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  adminSideProps(context, boostServerSideProps);

export default WaitingRefunds;