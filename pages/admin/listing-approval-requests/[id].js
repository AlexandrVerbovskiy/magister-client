import React, { useState, useContext } from "react";
import { IndiceContext } from "../../../contexts";
import Sidebar from "../../../partials/admin/Sidebar";
import BreadCrumbs from "../../../partials/admin/base/BreadCrumbs";
import Header from "../../../partials/admin/Header";
import { useAdminPage } from "../../../hooks";
import { adminSideProps } from "../../../middlewares";
import {
  approveListingApprovalRequest,
  getAdminListingApprovalRequestOption,
  rejectListingApproveRequest,
} from "../../../services";
import InputView from "../../../components/admin/Form/InputView";
import TextareaView from "../../../components/admin/Form/TextareaView";
import MultyMarkersMap from "../../../components/Listings/MultyMarkersMap";
import { getFilePath, getListingImageByType } from "../../../utils";
import ListingPhotoView from "../../../components/admin/Listings/PhotoPopupView";
import RejectModal from "../../../components/admin/ListingApprovalRequests/RejectModal";
import ApproveModal from "../../../components/admin/ListingApprovalRequests/ApproveModal";
import { useIdPage } from "../../../hooks";
import STATIC from "../../../static";

const ListingApprovalRequest = (baseProps) => {
  const { props } = useIdPage({
    baseProps,
    getPagePropsFunc: ({ field, authToken }) =>
      getAdminListingApprovalRequestOption(field, authToken),
    onUpdate: (newProps) => {
      setListing(newProps.listing);
      setRequest(newProps.request);
    },
  });

  const [listing, setListing] = useState(props.listing);
  const [request, setRequest] = useState(props.request);
  const [mapCenter, setMapCenter] = useState(null);

  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { authToken, error: mainError } = useContext(IndiceContext);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  let categoryLevelLabel = "Third Level";

  if (listing.categoryLevel == 1) {
    categoryLevelLabel = "First Level";
  }

  if (listing.categoryLevel == 2) {
    categoryLevelLabel = "Second Level";
  }

  const handleRejectClick = (e) => {
    e.stopPropagation();
    setRejectModalOpen(true);
  };

  const handleApproveClick = (e) => {
    e.stopPropagation();
    setApproveModalOpen(true);
  };

  const handleRejectAcceptClick = async (description) => {
    await rejectListingApproveRequest(
      { listingId: listing.id, description },
      authToken
    );

    setRequest((prev) => ({
      ...prev,
      approved: false,
      rejectDescription: description,
    }));
  };

  const handleApproveAcceptClick = async () => {
    await approveListingApprovalRequest({ listingId: listing.id }, authToken);
    setListing((prev) => ({ ...prev, approved: true }));
    setRequest((prev) => ({ ...prev, approved: true }));
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden dark:bg-slate-900">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="mb-8">
              <BreadCrumbs
                links={[
                  {
                    title: "Listing Approve Requests",
                    href: "/admin/listing-approval-requests",
                  },
                  { title: listing["name"] },
                ]}
              />
            </div>

            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
              <div className="flex flex-col md:flex-row md:-mr-px">
                <div className="grow w-full">
                  <div className="p-6 space-y-6">
                    <h2 className="max-w-full overflow-separate text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5">
                      {listing.name}
                    </h2>

                    <section>
                      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                        Base information
                      </h2>

                      <div className="flex flex-col gap-2">
                        <div className="flex w-full gap-2">
                          <div className="w-full sm:w-1/2">
                            <InputView
                              value={listing.name}
                              label="User Name"
                              name="name"
                              placeholder="Name"
                              labelClassName="block text-sm font-medium mb-1"
                              inputClassName="form-input w-full"
                            />
                          </div>

                          <div className="w-full sm:w-1/2">
                            <InputView
                              value={listing.userName}
                              label="Owner"
                              name="owner"
                              placeholder="owner"
                              labelClassName="block text-sm font-medium mb-1"
                              inputClassName="form-input w-full"
                            />
                          </div>
                        </div>
                        <div className="flex w-full gap-2">
                          <div className="w-1/2">
                            <InputView
                              value={categoryLevelLabel}
                              label="Category level"
                              name="categoryLevelLabel"
                              placeholder="category"
                              labelClassName="block text-sm font-medium mb-1"
                              inputClassName="form-input w-full"
                            />
                          </div>

                          <div className="w-1/2">
                            <InputView
                              value={
                                listing.categoryName ?? listing.otherCategory
                              }
                              label="Category"
                              placeholder="category"
                              name="categoryName"
                              labelClassName="block text-sm font-medium mb-1"
                              inputClassName="form-input w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                        Pricing
                      </h2>

                      <div className="flex flex-col gap-2">
                        <div className="flex w-full gap-2">
                          <div className="w-full sm:w-1/2">
                            <InputView
                              value={listing.pricePerDay}
                              name="pricePerDay"
                              label={`Rental price per day (${STATIC.CURRENCY})`}
                              placeholder="12.00"
                              labelClassName="block text-sm font-medium mb-1"
                              inputClassName="form-input w-full"
                            />
                          </div>

                          <div className="w-full sm:w-1/2">
                            <InputView
                              label={`Item value (${STATIC.CURRENCY})`}
                              name="compensationCost"
                              placeholder="532.00"
                              labelClassName="block text-sm font-medium mb-1"
                              value={listing.compensationCost}
                              inputClassName="form-input w-full"
                            />
                          </div>
                        </div>

                        <div className="flex w-full gap-2">
                          <div className="w-full sm:w-1/2">
                            <InputView
                              value={listing.minRentalDays}
                              name="minRentalDays"
                              label="Minimum rental days"
                              placeholder="0"
                              labelClassName="block text-sm font-medium mb-1"
                              inputClassName="form-input w-full"
                            />
                          </div>

                          <div className="w-full sm:w-1/2">
                            <InputView
                              label="Quantity"
                              name="countStoredItems"
                              placeholder="1"
                              labelClassName="block text-sm font-medium mb-1"
                              value={listing.countStoredItems}
                              inputClassName="form-input w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </section>

                    <section>
                      <div className="flex w-full gap-2">
                        <div className="w-full sm:w-1/2">
                          <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                            Collection Location
                          </h2>

                          <div className="w-full mb-2">
                            <InputView
                              name="city"
                              label="City"
                              placeholder="City"
                              labelClassName="block text-sm font-medium mb-1"
                              value={listing.city}
                              inputClassName="form-input w-full"
                            />
                          </div>

                          <div className="w-full mb-2">
                            <InputView
                              name="postcode"
                              label="Postcode"
                              placeholder="e.g. 55 County Laois"
                              labelClassName="block text-sm font-medium mb-1"
                              value={listing.postcode}
                              inputClassName="form-input w-full"
                            />
                          </div>

                          <div className="w-full mb-2">
                            <InputView
                              name="address"
                              label="Address"
                              placeholder="e.g. 55 County Laois"
                              labelClassName="block text-sm font-medium mb-1"
                              value={listing.address}
                              inputClassName="form-input w-full"
                            />
                          </div>
                        </div>

                        <div className="w-full sm:w-1/2">
                          <div
                            className="flex w-full admin-map-parent flex-col md:flex-row mb-2"
                            style={{ height: "240px" }}
                          >
                            <MultyMarkersMap
                              userLocation={userLocation}
                              setUserLocation={setUserLocation}
                              markers={[
                                {
                                  id: 1,
                                  lat: listing.lat,
                                  lng: listing.lng,
                                  radius: listing.radius,
                                },
                              ]}
                              baseCenter={{
                                lat: listing.lat,
                                lng: listing.lng,
                              }}
                              center={mapCenter}
                              setCenter={setMapCenter}
                            />
                          </div>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                        Photos
                      </h2>

                      <div
                        className="flex flex-wrap mt-5"
                        style={{ width: "100%", gap: "0.5rem" }}
                      >
                        {listing.listingImages.map((image) => (
                          <ListingPhotoView
                            key={image.id}
                            src={getListingImageByType(image.link, image.type)}
                          />
                        ))}
                      </div>
                    </section>

                    <section>
                      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                        Description
                      </h2>

                      <div className="w-full">
                        <TextareaView
                          name="description"
                          value={listing.description}
                          row="7"
                          placeholder="Details..."
                        />
                      </div>
                    </section>

                    <section>
                      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                        Approve Information
                      </h2>
                      <div className="flex flex-wrap mt-2">
                        <div className="mr-2">
                          <label
                            className="block text-sm font-medium mb-1"
                            htmlFor="approved"
                          >
                            Current Listing Status:
                          </label>{" "}
                        </div>
                        <div className="block text-sm">
                          {listing.approved ? "Approved" : "Not approved"}
                        </div>
                      </div>

                      <div className="flex flex-wrap mt-2">
                        <div className="mr-2">
                          <label
                            className="block text-sm font-medium mb-1"
                            htmlFor="approved"
                          >
                            Listing Request Status:
                          </label>
                        </div>
                        <div className="block text-sm">
                          {request.approved === null
                            ? "Waiting for approval"
                            : request.approved
                            ? "Accepted approval"
                            : "Rejected approval"}
                        </div>
                      </div>

                      {request.rejectDescription && (
                        <div className="flex flex-wrap mt-2 w-full break-words">
                          <label
                            className="block text-sm mb-1 w-full break-words"
                            htmlFor="approved"
                          >
                            <span className="font-medium ">
                              Listing Reject Description:{" "}
                            </span>
                            {request.rejectDescription}
                          </label>
                        </div>
                      )}
                    </section>
                  </div>

                  {request.approved === null && (
                    <footer>
                      <div className="flex flex-col px-6 py-5 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex self-end">
                          <button
                            type="button"
                            onClick={handleRejectClick}
                            className="btn bg-rose-500 hover:bg-rose-600 text-white ml-3"
                          >
                            Reject
                          </button>
                          <button
                            type="button"
                            onClick={handleApproveClick}
                            className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3"
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    </footer>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        <RejectModal
          active={rejectModalOpen}
          close={() => setRejectModalOpen(false)}
          onAcceptClick={handleRejectAcceptClick}
        />

        <ApproveModal
          active={approveModalOpen}
          close={() => setApproveModalOpen(false)}
          onAcceptClick={handleApproveAcceptClick}
          userVerified={request.userVerified}
        />
      </div>
    </div>
  );
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const id = context.params.id;

  const options = await getAdminListingApprovalRequestOption(
    id,
    baseSideProps.authToken
  );

  return { ...options, pageTitle: `Approval requests #${id}` };
};

export const getServerSideProps = (context) =>
  adminSideProps({
    context,
    callback: boostServerSideProps,
  });

export default ListingApprovalRequest;
