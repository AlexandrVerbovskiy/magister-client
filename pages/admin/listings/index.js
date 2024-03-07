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
} from "../../../services";
import SearchForm from "../../../partials/admin/actions/SearchForm";
import ListingsTable from "../../../components/admin/Listings/Table";
import { IndiceContext } from "../../../contexts";
import DeleteAccept from "../../../components/admin/DeleteAccept";

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
                </div>
              </div>

              <ListingsTable
                listings={listings}
                orderField={order}
                orderType={orderType}
                onClickTh={handleChangeOrder}
                totalCount={countItems}
                onClickDelete={handleOpenDeleteModal}
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
    context.query,
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  adminSideProps(context, boostServerSideProps);

export default Listings;
