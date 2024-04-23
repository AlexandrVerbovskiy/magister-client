import React, { useState, useContext, useEffect } from "react";
import Sidebar from "../../../partials/admin/Sidebar";
import Header from "../../../partials/admin/Header";
import BreadCrumbs from "../../../partials/admin/base/BreadCrumbs";
import { useAdminPage, usePagination } from "../../../hooks";
import { adminSideProps } from "../../../middlewares";
import PaginationNumeric from "../../../components/admin/PaginationNumeric";
import {
  getAdminListingListPageOptions,
  getAdminListingList,
  deleteListingByAdmin,
  changeActiveListingByAdmin,
} from "../../../services";
import SearchForm from "../../../partials/admin/actions/SearchForm";
import ListingsTable from "../../../components/admin/Listings/Table";
import { IndiceContext } from "../../../contexts";
import DeleteAccept from "../../../components/admin/DeleteAccept";
import Link from "next/link";
import { baseListPageParams } from "../../../utils";

const Listings = (pageProps) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, success, authToken } = useContext(IndiceContext);

  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const [toDeleteUserInfo, setToDeleteUserInfo] = useState({});

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
    items: listings,
    rebuild,
    setItemFields,
  } = usePagination({
    getItemsFunc: (data) => getAdminListingList(data, authToken),
    onError: (e) => error.set(e.message),
    defaultData: pageProps,
  });

  const handleCloseDeleteModal = () => {
    setToDeleteUserInfo(null);
    setDangerModalOpen(false);
  };

  const handleOpenDeleteModal = (id, name) => {
    setToDeleteUserInfo({ name, id });
    setDangerModalOpen(true);
  };

  const onDeleteAccept = async () => {
    try {
      const { name, id } = toDeleteUserInfo;
      await deleteListingByAdmin(id, authToken);
      handleCloseDeleteModal();
      await rebuild();
      success.set(`${name} deleted successfully!`);
    } catch (e) {
      error.set(e.message);
    }
  };

  const handleChangeActiveClick = async (id, name) => {
    try {
      const { active } = await changeActiveListingByAdmin(id, authToken);
      setItemFields({ active }, id);
      success.set(
        `${name} ${active ? "activated" : "deactivated"} successfully!`
      );
    } catch (e) {
      error.set(e.message);
    }
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
                <BreadCrumbs links={[{ title: "Listings" }]} />
                <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                  <SearchForm value={filter} onInput={changeFilter} />

                  <Link
                    href="/admin/listings/create"
                    className="btn bg-indigo-500 hover:bg-indigo-600 text-white"
                  >
                    <svg
                      className="w-4 h-4 fill-current opacity-50 shrink-0"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                    </svg>
                    <span className="hidden xs:block ml-2">Add Listing</span>
                  </Link>
                </div>
              </div>

              <ListingsTable
                listings={listings}
                orderField={order}
                orderType={orderType}
                onClickTh={handleChangeOrder}
                totalCount={countItems}
                onClickDelete={handleOpenDeleteModal}
                onClickChangeActive={handleChangeActiveClick}
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

      <DeleteAccept
        title="Delete 1 listing?"
        body={`Are you sure you want to remove listing ${
          toDeleteUserInfo?.name ?? ""
        } from the system? All information about it will be lost`}
        modalOpen={dangerModalOpen}
        setModalOpen={setDangerModalOpen}
        handleCloseDeleteModal={handleCloseDeleteModal}
        onDeleteAccept={onDeleteAccept}
      />
    </div>
  );
};

const boostServerSideProps = async ({ context, baseSideProps }) => {
  const options = await getAdminListingListPageOptions(
    baseListPageParams(context.query),
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  adminSideProps(context, boostServerSideProps);

export default Listings;
