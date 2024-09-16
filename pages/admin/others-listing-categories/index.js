import { useContext } from "react";
import { useAdminPage, usePagination } from "../../../hooks";
import { IndiceContext } from "../../../contexts";
import PaginationNumeric from "../../../components/admin/PaginationNumeric";
import BreadCrumbs from "../../../partials/admin/base/BreadCrumbs";
import SearchForm from "../../../partials/admin/actions/SearchForm";
import Header from "../../../partials/admin/Header";
import Sidebar from "../../../partials/admin/Sidebar";
import OtherCategoriesTable from "../../../components/admin/ListingOtherCategories/Table";
import { getAdminOthersListingCategoriesOptions } from "../../../services";
import { adminSideProps } from "../../../middlewares";
import { baseListPageParams } from "../../../utils";
import { getAdminOthersListingCategories } from "../../../services/listingCategories";

const OthersList = (pageProps) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, authToken } = useContext(IndiceContext);

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
    items: otherCategories,
    setItemFields,
    loading: paginationLoading,
  } = usePagination({
    getItemsFunc: (data) => getAdminOthersListingCategories(data, authToken),
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
              <div className="md:flex md:justify-between md:items-center mb-8">
                <BreadCrumbs links={[{ title: "Others Listing Categories" }]} />
                <div className="flex md:auto-cols-max justify-start md:justify-end gap-2 mt-2 md:mt-0 flex-col md:flex-row">
                  <SearchForm value={filter} onInput={changeFilter} />
                </div>
              </div>

              <OtherCategoriesTable
                categories={otherCategories}
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
  const options = await getAdminOthersListingCategoriesOptions(
    baseListPageParams(context.query),
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  adminSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "Listing categories" },
  });

export default OthersList;
