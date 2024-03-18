import React, { useState, useEffect, useContext } from "react";
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
import ModalBlank from "../../../components/admin/ModalBlank";
import ErrorSpan from "../../../components/admin/ErrorSpan";
import MultyMarkersMap from "../../../components/Listings/MultyMarkersMap";
import { getListingImageByType } from "../../../utils";
import ImageView from "../../../components/admin/Form/ImageView";

const ListingPhotoView = ({ src }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState(null);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <div
        className="xl:w-1/4 lg:w-1/3 md:w-1/2 gallery-flex-parent listing-gallery-flex-parent"
        onClick={openPopup}
      >
        <div className="bg-gray-100 border shadow-md flex flex-col form-group">
          <div className="image-box cursor-zoom-in">
            <img
              src={src}
              alt="image"
              width="300px"
              height="300px"
              className="object-cover w-full h-auto"
            />
          </div>
        </div>
      </div>
      <ImageView open={isPopupOpen} imgSrc={src} close={closePopup} />
    </>
  );
};

const ListingApprovalRequest = ({
  request: baseRequest,
  listing: baseListing,
}) => {
  const [listing, setListing] = useState(baseListing);
  const [request, setRequest] = useState(baseRequest);

  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { error, success, authToken } = useContext(IndiceContext);

  const [disabled, setDisabled] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [declineDescription, setDeclineDescription] = useState("");
  const [declineDescriptionError, setDeclineDescriptionError] = useState(null);
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

  const handleInputDeclineDescription = (e) => {
    setDeclineDescription(e.target.value);
    setDeclineDescriptionError(null);
  };

  const handleRejectAcceptClick = async () => {
    setDeclineDescriptionError(null);

    if (declineDescription.length < 1) {
      setDeclineDescriptionError(
        "You must enter the reason for the rejection of the verification"
      );
      return;
    }

    try {
      await rejectListingApproveRequest(
        { listingId: listing.id, description: declineDescription },
        authToken
      );

      setRejectModalOpen(false);

      setRequest((prev) => ({
        ...prev,
        approved: false,
        rejectDescription: declineDescription,
      }));
      success.set("Rejected successfully");
    } catch (e) {
      error.set(e);
    }
  };

  const handleApproveAcceptClick = async () => {
    try {
      await approveListingApprovalRequest({ listingId: listing.id }, authToken);
      setApproveModalOpen(false);
      setListing((prev) => ({ ...prev, approved: true }));
      setRequest((prev) => ({ ...prev, approved: true }));
      success.set("Approved successfully");
    } catch (e) {
      error.set(e);
    }
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
                    <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5">
                      {listing.name}
                    </h2>

                    <section>
                      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                        Base information
                      </h2>

                      <div className="flex flex-col gap-2">
                        <div className="w-full">
                          <InputView
                            value={listing.name}
                            label="User Name"
                            name="name"
                            placeholder="Name of tool"
                            labelClassName="block text-sm font-medium mb-1"
                            inputClassName="form-input w-full"
                          />
                        </div>

                        <div className="flex w-full gap-2">
                          <div className=" w-full sm:w-1/2">
                            <InputView
                              label="Keywords:"
                              name="keyWords"
                              placeholder="Maximum 15, should be separated by commas"
                              labelClassName="block text-sm font-medium mb-1"
                              value={listing.keyWords}
                              inputClassName="form-input w-full"
                            />
                          </div>

                          <div className=" w-full sm:w-1/2">
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
                              value={listing.categoryName}
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
                              label="Rental price per day"
                              placeholder="12.00"
                              labelClassName="block text-sm font-medium mb-1"
                              inputClassName="form-input w-full"
                            />
                          </div>

                          <div className="w-full sm:w-1/2">
                            <InputView
                              label="Item value"
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
                              label="Min rental days"
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
                      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                        Location
                      </h2>

                      <div className="flex flex-col gap-2">
                        <div className="flex w-full gap-2">
                          <div className="w-full sm:w-1/2">
                            <InputView
                              name="city"
                              label="City"
                              placeholder="City"
                              labelClassName="block text-sm font-medium mb-1"
                              value={listing.city}
                              inputClassName="form-input w-full"
                            />
                          </div>

                          <div className="w-full sm:w-1/2">
                            <InputView
                              name="postcode"
                              label="Postcode"
                              placeholder="e.g. 55 County Laois"
                              labelClassName="block text-sm font-medium mb-1"
                              value={listing.postcode}
                              inputClassName="form-input w-full"
                            />
                          </div>
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

                        <div
                          className="flex w-full admin-map-parent"
                          style={{ height: "400px" }}
                        >
                          <MultyMarkersMap
                            userLocation={userLocation}
                            setUserLocation={setUserLocation}
                            markers={[
                              {
                                id: 1,
                                lat: listing.rentalLat,
                                lng: listing.rentalLng,
                                radius: listing.rentalRadius,
                              },
                            ]}
                            baseCenter={{
                              lat: listing.rentalLat,
                              lng: listing.rentalLng,
                            }}
                            center={mapCenter}
                            setCenter={setMapCenter}
                          />
                        </div>
                      </div>
                    </section>

                    <section>
                      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                        Photos
                      </h2>

                      <div
                        className="flex flex-wrap"
                        style={{ width: "100%", gridGap: "0.5rem" }}
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
                        Details
                      </h2>

                      <div className="w-full">
                        <TextareaView
                          name="description"
                          value={listing.description}
                          row="7"
                        />
                      </div>
                    </section>

                    <section>
                      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                        Rental Terms
                      </h2>

                      <div className="w-full">
                        <TextareaView
                          name="rentalTerms"
                          value={listing.rentalTerms}
                          row="7"
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
                          </label>{" "}
                        </div>
                        <div className="block text-sm">
                          {request.approved ? "Approved" : "Not approved"}
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
                            className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3"
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

        <ModalBlank
          id="access-decline"
          modalOpen={rejectModalOpen}
          setModalOpen={setRejectModalOpen}
        >
          <div className="p-5 flex space-x-4">
            <div style={{ width: "100%" }}>
              <div className="mb-2">
                <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  Are you sure you want reject this request?
                </div>
              </div>
              <div className="text-sm mb-2">
                <div className="space-y-2">
                  <p>Enter the reason for the rejection</p>
                </div>
              </div>

              <div className="mb-2">
                <textarea
                  name="declineDescription"
                  className="form-input w-full"
                  rows="6"
                  value={declineDescription}
                  onChange={handleInputDeclineDescription}
                />
                <ErrorSpan error={declineDescriptionError} />
              </div>

              <div className="flex flex-wrap justify-end space-x-2">
                <button
                  onClick={() => setRejectModalOpen(false)}
                  className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectAcceptClick}
                  className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </ModalBlank>

        <ModalBlank
          id="access-accept"
          modalOpen={approveModalOpen}
          setModalOpen={setApproveModalOpen}
        >
          <div className="p-5 flex space-x-4">
            <div style={{ width: "100%" }}>
              <div className="mb-2">
                <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  Are you sure you want accept this request?
                </div>
              </div>

              <div className="text-sm mb-2">
                <div className="space-y-2">
                  <p>
                    Once you approve this product, other users will be able to
                    rent it
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap justify-end space-x-2">
                <button
                  onClick={() => setApproveModalOpen(false)}
                  className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApproveAcceptClick}
                  className="btn-sm bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </ModalBlank>
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

  return { ...options };
};

export const getServerSideProps = (context) =>
  adminSideProps(context, boostServerSideProps);

export default ListingApprovalRequest;
