import { useContext, useState } from "react";
import { IndiceContext } from "../../contexts";
import { getAdminDisputeListOptions, getDisputeList } from "../../services";
import { useAdminPage, useBaseAdminFilter, usePagination } from "../../hooks";
import { baseAdminTimeListPageParams } from "../../utils";
import { supportSideProps } from "../../middlewares";
import BaseListSubHeader from "../../components/admin/BaseListSubHeader";
import PaginationNumeric from "../../components/admin/PaginationNumeric";
import DisputesTable from "../../components/admin/Disputes/Table";
import Sidebar from "../../partials/admin/Sidebar";
import Header from "../../partials/admin/Header";
import BreadCrumbs from "../../partials/admin/base/BreadCrumbs";

const Disputes = (pageProps) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, authToken } = useContext(IndiceContext);
  const [typesCount, setTypesCount] = useState(pageProps.typesCount);

  const {
    timeFilterType,
    getBaseAdminFilterDopProps,
    handleChangeTimeFilterType,
    type,
    handleChangeType,
  } = useBaseAdminFilter({ props: pageProps, defaultTypeValue: "all" });

  const onRebuild = (data) => {
    setTypesCount(data.typesCount);
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
    items: disputes,
    rebuild,
    setItemFields,
    loading: paginationLoading,
  } = usePagination({
    getItemsFunc: (data) => getDisputeList(data, authToken),
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
                <BreadCrumbs links={[{ title: "Disputes" }]} />
              </div>

              <BaseListSubHeader
                type={type}
                handleChangeType={handleChangeType}
                typeOptions={[
                  {
                    value: "open",
                    title: "Open",
                    count: typesCount["openCount"],
                  },
                  {
                    value: "solved",
                    title: "Solved",
                    count: typesCount["solvedCount"],
                  },
                  {
                    value: "unsolved",
                    title: "Unsolved",
                    count: typesCount["unsolvedCount"],
                  },
                  {
                    value: "all",
                    title: "All",
                    count: typesCount["allCount"],
                  },
                ]}
                filter={filter}
                handleChangeFilter={changeFilter}
                timeFilterType={timeFilterType}
                handleChangeTimeFilterType={handleChangeTimeFilterType}
                rebuild={rebuild}
              />

              <DisputesTable
                disputes={disputes}
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

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const type = context.query.type ?? null;
  const params = { ...baseAdminTimeListPageParams(context.query), type };
  const options = await getAdminDisputeListOptions(
    params,
    baseSideProps.authToken
  );
  return { ...options };
};

export const getServerSideProps = (context) =>
  supportSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "Disputes" },
  });

export default Disputes;
