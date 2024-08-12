import React, { useState, useContext } from "react";
import Sidebar from "../../../partials/admin/Sidebar";
import Header from "../../../partials/admin/Header";
import BreadCrumbs from "../../../partials/admin/base/BreadCrumbs";
import SearchForm from "../../../partials/admin/actions/SearchForm";
import PaginationNumeric from "../../../components/admin/PaginationNumeric";
import DropdownFilter from "../../../components/admin/DropdownFilter";
import FilterRadioOption from "../../../components/admin/Form/FilterRadioOption";

import { adminSideProps } from "../../../middlewares";

import { useAdminPage, usePagination } from "../../../hooks";
import { IndiceContext } from "../../../contexts";
import {
  getAdminSearchedWordListPageOptions,
  getSearchedWordList,
} from "../../../services";
import SearchedWordTable from "../../../components/admin/SearchedWord/Table";
import { useRouter } from "next/router";
import { baseListPageParams } from "../../../utils";

const SearchedWords = (pageProps) => {
  const router = useRouter();

  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, authToken } = useContext(IndiceContext);

  const baseViewedFilter = router.query.viewed ?? "all";
  const baseAcceptedFilter = router.query.accepted ?? "all";

  const [viewedFilter, setViewedFilter] = useState(baseViewedFilter);
  const [acceptedFilter, setAcceptedFilter] = useState(baseAcceptedFilter);

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
    items: searchedWords,
    rebuild,
    loading: paginationLoading,
  } = usePagination({
    getItemsFunc: (data) => getSearchedWordList(data, authToken),
    onError: (e) => error.set(e.message),
    getDopProps: () => ({
      viewed: {
        value: viewedFilter,
        hidden: (newValue) => newValue == "all",
      },
      accepted: {
        value: acceptedFilter,
        hidden: (newValue) => newValue == "all",
      },
    }),
    defaultData: pageProps,
  });

  const handleChangeAcceptedFilter = (value) => {
    setAcceptedFilter(value);
    rebuild({ accepted: value });
  };

  const handleChangeViewedFilter = (value) => {
    setViewedFilter(value);
    rebuild({ viewed: value });
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden dark:bg-slate-900">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="relative">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className="md:flex md:justify-between md:items-center mb-8">
                <BreadCrumbs links={[{ title: "Users Search Story" }]} />

                <div className="flex md:auto-cols-max justify-start md:justify-end gap-2 mt-2 md:mt-0 flex-col md:flex-row">
                  <div className="flex gap-2">
                    <SearchForm value={filter} onInput={changeFilter} />
                    <DropdownFilter align="right">
                      <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase pt-1.5 pb-2 px-3">
                        Is Viewed
                      </div>
                      <ul className="mb-4">
                        {[
                          { value: "yes", label: "Viewed" },
                          { value: "no", label: "Unviewed" },
                          { value: "all", label: "All" },
                        ].map((option) => (
                          <FilterRadioOption
                            key={option.value}
                            name="viewed"
                            label={option.label}
                            value={option.value}
                            currentValue={viewedFilter}
                            setCurrentValue={handleChangeViewedFilter}
                          />
                        ))}
                      </ul>

                      <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase pt-1.5 pb-2 px-3">
                        Is Accepted
                      </div>
                      <ul className="mb-4">
                        {[
                          { value: "yes", label: "Accepted" },
                          { value: "no", label: "Unaccepted" },
                          { value: "all", label: "All" },
                        ].map((option) => (
                          <FilterRadioOption
                            key={option.value}
                            name="accepted"
                            label={option.label}
                            value={option.value}
                            currentValue={acceptedFilter}
                            setCurrentValue={handleChangeAcceptedFilter}
                          />
                        ))}
                      </ul>
                    </DropdownFilter>
                  </div>
                </div>
              </div>

              <SearchedWordTable
                searchedWords={searchedWords}
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
  const options = await getAdminSearchedWordListPageOptions(
    baseListPageParams(context.query),
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  adminSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "Searched words" },
  });

export default SearchedWords;
