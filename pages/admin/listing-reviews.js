import BreadCrumbs from "../../partials/admin/base/BreadCrumbs";
import Sidebar from "../../partials/admin/Sidebar";
import Header from "../../partials/admin/Header";
import { supportSideProps } from "../../middlewares";
import {
  getAdminListingCommentListOptions,
  getListingCommentList,
} from "../../services";
import { baseAdminTimeListPageParams } from "../../utils";
import { useContext, useState } from "react";
import { IndiceContext } from "../../contexts";
import { useAdminPage, useBaseAdminFilter, usePagination } from "../../hooks";
import PaginationNumeric from "../../components/admin/PaginationNumeric";
import BaseListSubHeader from "../../components/admin/BaseListSubHeader";
import ListingCommentsTable from "../../components/admin/ListingComments/Table";

const ListingReviews = (pageProps) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, authToken } = useContext(IndiceContext);
  const [typesCount, setTypesCount] = useState(pageProps.typesCount);

  const {
    timeFilterType,
    getBaseAdminFilterDopProps,
    handleChangeTimeFilterType,
    type,
    handleChangeType,
  } = useBaseAdminFilter({ props: pageProps, defaultTypeValue: "suspended" });

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
    items: reviews,
    rebuild,
    setItemFields,
    loading: paginationLoading,
  } = usePagination({
    getItemsFunc: (data) => getListingCommentList(data, authToken),
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
                <BreadCrumbs links={[{ title: "Listing Reviews" }]} />
              </div>

              <BaseListSubHeader
                type={type}
                handleChangeType={handleChangeType}
                typeOptions={[
                  {
                    value: "suspended",
                    title: "Suspended",
                    count: typesCount["suspendedCount"],
                  },
                  {
                    value: "approved",
                    title: "Approved",
                    count: typesCount["approvedCount"],
                  },
                  {
                    value: "rejected",
                    title: "Rejected",
                    count: typesCount["rejectedCount"],
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

              <ListingCommentsTable
                reviews={reviews}
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
  const options = await getAdminListingCommentListOptions(
    params,
    baseSideProps.authToken
  );
  return { ...options };
};

export const getServerSideProps = (context) =>
  supportSideProps(context, boostServerSideProps);

export default ListingReviews;
