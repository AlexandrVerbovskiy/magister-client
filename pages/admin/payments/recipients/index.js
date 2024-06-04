import { useContext, useState } from "react";
import { IndiceContext } from "../../../../contexts";
import {
  useAdminPage,
  usePagination,
  useTimeTypeFilter,
} from "../../../../hooks";
import {
  getAdminRecipientPaymentList,
  getAdminRecipientPaymentListOptions,
} from "../../../../services";
import SearchForm from "../../../../partials/admin/actions/SearchForm";
import Sidebar from "../../../../partials/admin/Sidebar";
import Header from "../../../../partials/admin/Header";
import BreadCrumbs from "../../../../partials/admin/base/BreadCrumbs";
import PaginationNumeric from "../../../../components/admin/PaginationNumeric";
import DropdownFilter from "../../../../components/admin/DropdownFilter";
import {
  baseAdminTimeListPageParams,
  baseTimeListPageParams,
} from "../../../../utils";
import { adminSideProps } from "../../../../middlewares";
import { useRouter } from "next/router";
import FilterRadioOption from "../../../../components/admin/Form/FilterRadioOption";
import RecipientPaymentsTable from "../../../../components/admin/RecipientPayments/Table";
import DateSelect from "../../../../components/admin/DateSelect";

const RecipientPayments = (pageProps) => {
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, success, authToken } = useContext(IndiceContext);

  const [type, setType] = useState(router.query.type ?? "all");
  const [status, setStatus] = useState(router.query.status ?? "all");

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
    items: payments,
    rebuild,
    setItemFields,
  } = usePagination({
    getItemsFunc: (data) => getAdminRecipientPaymentList(data, authToken),
    onError: (e) => error.set(e.message),
    getDopProps: () => ({
      ...geTimeTypeDopProps(),
      type: {
        value: type,
        hidden: (value) => value == "all",
      },
      status: {
        value: status,
        hidden: (value) => value == "all",
      },
    }),
    defaultData: pageProps,
  });

  const handleChangeTypeFilter = (value) => {
    setType(value);
    rebuild({ type: value });
  };

  const handleChangeStatusFilter = (value) => {
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
              <div className="sm:flex sm:justify-between sm:items-center mb-8">
                <BreadCrumbs links={[{ title: "Recipient Payments" }]} />
                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                  <SearchForm
                    placeholder="Search by Transfer Id"
                    value={filter}
                    onInput={changeFilter}
                  />

                  <DateSelect
                    value={timeFilterType}
                    setValue={(value) =>
                      handleChangeTimeFilterType(value, rebuild)
                    }
                  />

                  <DropdownFilter align="right">
                    <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase pt-1.5 pb-2 px-3">
                      Status
                    </div>
                    <ul className="mb-4">
                      {[
                        { value: "waiting", label: "Waiting" },
                        { value: "failed", label: "Failed" },
                        { value: "completed", label: "Completed" },
                        { value: "cancelled", label: "Cancelled" },
                        { value: "all", label: "All" },
                      ].map((option) => (
                        <FilterRadioOption
                          key={option.value}
                          name="status"
                          label={option.label}
                          value={option.value}
                          currentValue={status}
                          setCurrentValue={handleChangeStatusFilter}
                        />
                      ))}
                    </ul>
                    <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase pt-1.5 pb-2 px-3">
                      Type
                    </div>
                    <ul className="mb-4">
                      {[
                        { value: "rental", label: "Rental" },
                        { value: "refund", label: "Refund" },
                        { value: "all", label: "All" },
                      ].map((option) => (
                        <FilterRadioOption
                          key={option.value}
                          name="type"
                          label={option.label}
                          value={option.value}
                          currentValue={type}
                          setCurrentValue={handleChangeTypeFilter}
                        />
                      ))}
                    </ul>
                  </DropdownFilter>
                </div>
              </div>

              <RecipientPaymentsTable
                payments={payments}
                orderField={order}
                orderType={orderType}
                onClickTh={handleChangeOrder}
                totalCount={countItems}
                viewPath="/payments/recipients"
                setItemFields={setItemFields}
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

  const params = {
    ...baseAdminTimeListPageParams(context.query),
    status,
    type,
  };

  const options = await getAdminRecipientPaymentListOptions(
    params,
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  adminSideProps(context, boostServerSideProps);

export default RecipientPayments;
