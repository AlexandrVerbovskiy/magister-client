import { useContext } from "react";
import {
  useAdminPage,
  useBaseAdminFilter,
  useChangeTimeFilter,
  useInitPaginationTimeFilter,
  usePagination,
} from "../../../../hooks";
import { IndiceContext } from "../../../../contexts";
import {
  getAdminSenderPaymentList,
  getAdminSenderPaymentListOptions,
} from "../../../../services";
import { adminSideProps } from "../../../../middlewares";
import PaginationNumeric from "../../../../components/admin/PaginationNumeric";
import SearchForm from "../../../../partials/admin/actions/SearchForm";
import BreadCrumbs from "../../../../partials/admin/base/BreadCrumbs";
import Header from "../../../../partials/admin/Header";
import Sidebar from "../../../../partials/admin/Sidebar";
import { baseTimeListPageParams } from "../../../../utils";
import Datepicker from "../../../../components/admin/Datepicker";
import SenderPaymentsTable from "../../../../components/admin/SenderPayments/Table";
import BaseListSubHeader from "../../../../components/admin/BaseListSubHeader";

const SenderPayments = (pageProps) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, success, authToken } = useContext(IndiceContext);

  const {
    timeFilterType,
    getBaseAdminFilterDopProps,
    handleChangeTimeFilterType,
    type,
    handleChangeType,
  } = useBaseAdminFilter(pageProps);

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
    getItemsFunc: (data) => getAdminSenderPaymentList(data, authToken),
    onError: (e) => error.set(e.message),
    getDopProps: getBaseAdminFilterDopProps,
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
                <BreadCrumbs links={[{ title: "Sender Payments" }]} />
              </div>

              <BaseListSubHeader
                type={type}
                handleChangeType={handleChangeType}
                typeOptions={[
                  { value: "all", title: "All", count: 67 },
                  { value: "paypal", title: "Paypal", count: 19 },
                  { value: "bank-transfer", title: "Bank Transfer", count: 14 },
                ]}
                filter={filter}
                filterPlaceholder="Search by Transfer Id"
                handleChangeFilter={changeFilter}
                timeFilterType={timeFilterType}
                handleChangeTimeFilterType={handleChangeTimeFilterType}
                rebuild={rebuild}
              />

              <SenderPaymentsTable
                payments={payments}
                orderField={order}
                orderType={orderType}
                onClickTh={handleChangeOrder}
                totalCount={countItems}
                viewPath="/payments/senders"
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
  const options = await getAdminSenderPaymentListOptions(
    baseTimeListPageParams(context.query),
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  adminSideProps(context, boostServerSideProps);

export default SenderPayments;
