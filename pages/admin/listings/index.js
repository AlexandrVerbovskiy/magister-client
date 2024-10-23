import React, { useState, useContext } from "react";
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
import { baseAdminTimeListPageParams } from "../../../utils";
import BaseListSubHeaderDropdown from "../../../components/admin/BaseListSubHeaderDropdown";

const Listings = (pageProps) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, success, authToken } = useContext(IndiceContext);

  const [dangerModalOpen, setDangerModalOpen] = useState(false);
  const [toDeleteUserInfo, setToDeleteUserInfo] = useState({});

  const [activeFilter, setActiveFilter] = useState(pageProps.active ?? "all");
  const [approvedFilter, setApprovedFilter] = useState(
    pageProps.approved ?? "all"
  );

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
    loading: paginationLoading,
  } = usePagination({
    getItemsFunc: (data) => getAdminListingList(data, authToken),
    onError: (e) => error.set(e.message),
    defaultData: pageProps,
    getDopProps: () => ({
      approved: {
        value: approvedFilter,
        hidden: (value) => value == "all",
      },
      active: {
        value: activeFilter,
        hidden: (value) => value == "all",
      },
    }),
  });

  const handleCloseDeleteModal = () => {
    setToDeleteUserInfo(null);
    setDangerModalOpen(false);
  };

  const handleOpenDeleteModal = (id, name) => {
    setToDeleteUserInfo({ name, id });
    setDangerModalOpen(true);
  };

  const handleChangeActiveFilter = (newActive) => {
    setActiveFilter(newActive);
    rebuild({ active: newActive });
  };

  const handleChangeApprovedFilter = (newApproved) => {
    setApprovedFilter(newApproved);
    rebuild({ approved: newApproved });
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
              <div className="md:flex md:justify-between md:items-center mb-8">
                <BreadCrumbs links={[{ title: "Listings" }]} />
                <div className="flex md:auto-cols-max justify-start md:justify-end gap-2 mt-2 md:mt-0 flex-col md:flex-row">
                  <div className="flex gap-2">
                    <SearchForm value={filter} onInput={changeFilter} />

                    <BaseListSubHeaderDropdown
                      listFilters={[
                        {
                          name: "active",
                          label: "Active",
                          options: [
                            {
                              value: "active",
                              title: "Active",
                            },
                            {
                              value: "inactive",
                              title: "Inactive",
                            },
                            { value: "all", title: "All" },
                          ],
                          value: activeFilter,
                          onChange: handleChangeActiveFilter,
                        },
                        {
                          name: "approved",
                          label: "Approved",
                          options: [
                            {
                              value: "approved",
                              title: "Approved",
                            },
                            {
                              value: "unapproved",
                              title: "Unapproved",
                            },
                            { value: "all", title: "All" },
                          ],
                          value: approvedFilter,
                          onChange: handleChangeApprovedFilter,
                        },
                      ]}
                    />
                  </div>

                  <Link
                    href="/admin/listings/create/"
                    className="btn bg-teal-500 hover:bg-teal-600 text-white"
                  >
                    <svg
                      className="w-4 h-4 fill-current opacity-50 shrink-0"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                    </svg>
                    <span className="ml-2">Add Listing</span>
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
    {
      ...baseAdminTimeListPageParams(context.query),
      active: context.query["active"],
      approved: context.query["approved"],
    },
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  adminSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "Listings" },
  });

export default Listings;
