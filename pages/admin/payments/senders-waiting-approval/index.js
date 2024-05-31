import { useContext, useState } from "react";
import {
  useAdminPage,
  useBaseAdminFilter,
  usePagination,
} from "../../../../hooks";
import { IndiceContext } from "../../../../contexts";
import {
  getAdminSenderWaitingApprovalList,
  getAdminSenderWaitingApprovalListOptions,
} from "../../../../services";
import { adminSideProps } from "../../../../middlewares";
import PaginationNumeric from "../../../../components/admin/PaginationNumeric";
import SearchForm from "../../../../partials/admin/actions/SearchForm";
import BreadCrumbs from "../../../../partials/admin/base/BreadCrumbs";
import Header from "../../../../partials/admin/Header";
import Sidebar from "../../../../partials/admin/Sidebar";
import {
  baseAdminTimeListPageParams,
} from "../../../../utils";
import Datepicker from "../../../../components/admin/Datepicker";
import SenderPaymentsTable from "../../../../components/admin/SenderPayments/Table";
import BaseListSubHeader from "../../../../components/admin/BaseListSubHeader";

const SenderPayments = (pageProps) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, success, authToken } = useContext(IndiceContext);
  const [statusCount, setStatusCount] = useState(pageProps.statusCount);

  const {
    timeFilterType,
    getBaseAdminFilterDopProps,
    handleChangeTimeFilterType,
    type,
    handleChangeType,
  } = useBaseAdminFilter(pageProps);

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
    items: payments,
    rebuild,
    options,
  } = usePagination({
    getItemsFunc: (data) => getAdminSenderWaitingApprovalList(data, authToken),
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
              <div className="sm:flex sm:justify-between sm:items-center mb-8">
                <BreadCrumbs links={[{ title: "Sender Waiting Payments" }]} />
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
                    value: "waiting",
                    title: "Waiting",
                    count: statusCount["waitingCount"],
                  },
                  {
                    value: "approved",
                    title: "Approved",
                    count: statusCount["approvedCount"],
                  },
                  {
                    value: "rejected",
                    title: "Rejected",
                    count: statusCount["rejectedCount"],
                  },
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
                viewPath="/payments/senders-waiting-approval"
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
  const options = await getAdminSenderWaitingApprovalListOptions(
    {
      ...baseAdminTimeListPageParams(context.query),
      type: context.query["type"],
    },
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  adminSideProps(context, boostServerSideProps);

export default SenderPayments;
