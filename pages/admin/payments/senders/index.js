import { useContext, useState } from "react";
import {
  useAdminPage,
  useBaseAdminFilter,
  usePagination,
} from "../../../../hooks";
import { IndiceContext } from "../../../../contexts";
import {
  getAdminSenderPaymentList,
  getAdminSenderPaymentListOptions,
} from "../../../../services";
import { adminSideProps } from "../../../../middlewares";
import PaginationNumeric from "../../../../components/admin/PaginationNumeric";
import BreadCrumbs from "../../../../partials/admin/base/BreadCrumbs";
import Header from "../../../../partials/admin/Header";
import Sidebar from "../../../../partials/admin/Sidebar";
import { baseAdminTimeListPageParams } from "../../../../utils";
import SenderPaymentsTable from "../../../../components/admin/SenderPayments/Table";
import BaseListSubHeader from "../../../../components/admin/BaseListSubHeader";
import STATIC from "../../../../static";

const SenderPayments = (pageProps) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, authToken } = useContext(IndiceContext);
  const [typeCount, setTypeCount] = useState(pageProps.typesCount);
  const [status, setStatus] = useState(pageProps.options.status ?? "all");
  const {
    timeFilterType,
    getBaseAdminFilterDopProps,
    handleChangeTimeFilterType,
    type,
    handleChangeType,
  } = useBaseAdminFilter({ props: pageProps });

  const onRebuild = (data) => {
    setTypeCount(data.typesCount);
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
    setItemFields,
    loading: paginationLoading,
  } = usePagination({
    getItemsFunc: (data) => getAdminSenderPaymentList(data, authToken),
    onError: (e) => error.set(e.message),
    getDopProps: () => ({
      ...getBaseAdminFilterDopProps(),
      status: {
        value: status,
        hidden: (value) => value == "all",
      },
    }),
    defaultData: pageProps,
    onRebuild,
  });

  const handleChangeStatus = (value) => {
    setStatus(value);
    rebuild({ status: value });
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden dark:bg-slate-900">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="relative">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className="mb-8">
                <BreadCrumbs links={[{ title: "Sender Payments" }]} />
              </div>

              <BaseListSubHeader
                type={type}
                handleChangeType={handleChangeType}
                typeOptions={[
                  {
                    value: "all",
                    title: "All",
                    count: typeCount["allCount"],
                  },
                  {
                    value: STATIC.PAYMENT_TYPES.PAYPAL,
                    title: "Paypal",
                    count: typeCount["paypalCount"],
                  },
                  {
                    value: STATIC.PAYMENT_TYPES.CREDIT_CARD,
                    title: "Credit Card",
                    count: typeCount["creditCardCount"],
                  },
                  {
                    value: STATIC.PAYMENT_TYPES.BANK_TRANSFER,
                    title: "Bank Transfer",
                    count: typeCount["bankTransferCount"],
                  },
                ]}
                filter={filter}
                filterPlaceholder="Search by Transfer Id"
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
              />

              <SenderPaymentsTable
                payments={payments}
                orderField={order}
                orderType={orderType}
                onClickTh={handleChangeOrder}
                totalCount={countItems}
                viewPath="/payments/senders"
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
  const options = await getAdminSenderPaymentListOptions(
    {
      ...baseAdminTimeListPageParams(context.query),
      type: context.query["type"],
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
    baseProps: { pageTitle: "Sender Payments" },
  });

export default SenderPayments;
