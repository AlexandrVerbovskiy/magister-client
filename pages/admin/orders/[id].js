import { supportSideProps } from "../../../middlewares";
import { getAdminOrderInfo } from "../../../services";
import { useAdminPage } from "../../../hooks";
import Sidebar from "../../../partials/admin/Sidebar";
import Header from "../../../partials/admin/Header";
import BreadCrumbs from "../../../partials/admin/base/BreadCrumbs";
import ListingPhotoView from "../../../components/admin/Listings/PhotoPopupView";
import {
  calculateCurrentTotalPrice,
  getFactOrderDays,
  getFilePath,
  getListingImageByType,
  moneyFormat,
  ownerGetsCalculate,
  tenantPaymentCalculate,
} from "../../../utils";
import { useState } from "react";
import MultyMarkersMap from "../../../components/Listings/MultyMarkersMap";
import InputView from "../../../components/admin/Form/InputView";
import TextareaView from "../../../components/admin/Form/TextareaView";
import Status from "../../../components/admin/Orders/Status";
import CancelStatus from "../../../components/admin/Orders/CancelStatus";
import { useIdPage } from "../../../hooks";

const ImageView = ({ path, onImageClick = () => {} }) => {
  const handleImageClick = (e) => {
    e.stopPropagation();
    onImageClick();
  };

  return (
    <div className="bg-gray-100 border relative rounded-lg overflow-hidden shadow-md xl:w-1/4 lg:w-1/3 md:w-1/2 gallery-flex-parent">
      <div
        className="flex flex-col form-group cursor-zoom-in"
        onClick={handleImageClick}
      >
        <img src={path} />
      </div>
    </div>
  );
};

const PreviousProposalElem = ({
  index,
  prevStartDate,
  prevEndDate,
  prevPricePerDay,
  prevTotalPrice,
  prevSenderName,
  prevGetterName,
  needBottomMargin = false,
}) => {
  return (
    <>
      <div className="flex flex-col gap-2 mb-2">
        <div className="flex w-full gap-2">
          <div className="w-full sm:w-1/2">
            <InputView
              value={prevSenderName}
              label="Request Sender"
              name={`prev_sender_name_${index}`}
              placeholder="Prev Sender"
              labelClassName="block text-sm font-medium mb-1"
              inputClassName="form-input w-full"
            />
          </div>

          <div className="w-1/2">
            <InputView
              value={prevGetterName}
              label="Request Recipient"
              name={`prev_getter_name_${index}`}
              placeholder="Prev Recipient"
              labelClassName="block text-sm font-medium mb-1"
              inputClassName="form-input w-full"
            />
          </div>
        </div>

        <div className="flex w-full gap-2">
          <div className="w-full sm:w-1/2">
            <InputView
              value={prevStartDate}
              label="Previous Start Date"
              name={`prev_start_date_${index}`}
              placeholder="Prev Start Date"
              labelClassName="block text-sm font-medium mb-1"
              inputClassName="form-input w-full"
            />
          </div>

          <div className="w-1/2">
            <InputView
              value={prevEndDate}
              label="Previous End Date"
              name={`prev_end_date_${index}`}
              placeholder="Prev End Date"
              labelClassName="block text-sm font-medium mb-1"
              inputClassName="form-input w-full"
            />
          </div>
        </div>

        <div className="flex w-full gap-2">
          <div className="w-full sm:w-1/2">
            <InputView
              value={prevPricePerDay}
              label="Previous Price Per Day"
              name={`prev_price_per_day_${index}`}
              placeholder="Prev Price Per Day"
              labelClassName="block text-sm font-medium mb-1"
              inputClassName="form-input w-full"
            />
          </div>

          <div className="w-1/2">
            <InputView
              value={prevTotalPrice}
              label="Previous Total Price"
              name={`prev_total_price_${index}`}
              placeholder="Prev Total Price"
              labelClassName="block text-sm font-medium mb-1"
              inputClassName="form-input w-full"
            />
          </div>
        </div>
      </div>
      {needBottomMargin && <hr className="my-8" />}
    </>
  );
};

const Order = (baseProps) => {
  const { props: order } = useIdPage({
    baseProps,
    getPagePropsFunc: ({ field, authToken }) =>
      getAdminOrderInfo(field, authToken),
  });
  const { requestsToUpdate, listingImages } = order;
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const [mapCenter, setMapCenter] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const activeRequestsToUpdate = requestsToUpdate.find(
    (request) => request.active
  );

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden dark:bg-slate-900">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="relative">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className="mb-8">
                <BreadCrumbs
                  links={[
                    { title: "Orders", href: "/admin/orders" },
                    { title: "#" + order.id },
                  ]}
                />
              </div>

              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
                <div className="flex flex-col md:flex-row md:-mr-px">
                  <div className="grow w-full">
                    <div className="p-6 space-y-6">
                      <h2 className="flex text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5 justify-between">
                        <div className="order-form-title max-w-full overflow-separate">{`Order a ${order.listingName} by ${order.tenantName}`}</div>
                        {order.cancelStatus ? (
                          <CancelStatus
                            status={order.cancelStatus}
                            baseClass="px-3 rounded-full shadow-2xl w-max"
                          />
                        ) : (
                          <Status
                            status={order.status}
                            payedId={order.payedId}
                            payedAdminApproved={order.payedAdminApproved}
                            payedWaitingApproved={order.payedWaitingApproved}
                            baseClass="min-w-fit form-input w-max ml-2"
                          />
                        )}
                      </h2>

                      <section>
                        <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                          Base information
                        </h2>

                        <div className="flex flex-col gap-2">
                          <div className="flex w-full gap-2">
                            <div className="w-full sm:w-1/2">
                              <InputView
                                value={order.listingName}
                                label="User Name"
                                name="name"
                                placeholder="Name of tool"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-1/2">
                              <InputView
                                value={
                                  order.listingCategoryName ??
                                  order.listingOtherCategory
                                }
                                label="Category"
                                placeholder="category"
                                name="categoryName"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>
                          </div>

                          <div className="flex w-full gap-2">
                            <div className="w-full sm:w-1/2">
                              <InputView
                                value={order.ownerName}
                                label="Listing Owner"
                                name="owner"
                                placeholder="Owner Name"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-1/2">
                              <InputView
                                value={order.tenantName}
                                label="Rental"
                                placeholder="Rental Name"
                                name="rental"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </section>

                      <section>
                        <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                          Current Proposal Info
                        </h2>

                        <div className="flex flex-col gap-2">
                          <div className="flex w-full gap-2">
                            <div className="w-full sm:w-1/2">
                              <InputView
                                name="from_date"
                                label="From Date"
                                placeholder="From Date"
                                labelClassName="block text-sm font-medium mb-1"
                                value={
                                  activeRequestsToUpdate
                                    ? activeRequestsToUpdate.newStartDate
                                    : order.offerStartDate
                                }
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-full sm:w-1/2">
                              <InputView
                                name="to_date"
                                label="To Date"
                                placeholder="To Date"
                                labelClassName="block text-sm font-medium mb-1"
                                value={
                                  activeRequestsToUpdate
                                    ? activeRequestsToUpdate.newEndDate
                                    : order.offerEndDate
                                }
                                inputClassName="form-input w-full"
                              />
                            </div>
                          </div>

                          <div className="flex w-full gap-2">
                            <div className="w-full sm:w-1/2">
                              <InputView
                                name="price_per_day"
                                label="Price Per Day, $"
                                placeholder="Price Per Day"
                                labelClassName="block text-sm font-medium mb-1"
                                value={
                                  activeRequestsToUpdate
                                    ? activeRequestsToUpdate.newPricePerDay
                                    : order.offerPricePerDay
                                }
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-full sm:w-1/2">
                              <InputView
                                name="total_price"
                                label="Total Price, $"
                                placeholder="Total Price"
                                labelClassName="block text-sm font-medium mb-1"
                                value={
                                  activeRequestsToUpdate
                                    ? moneyFormat(
                                        getFactOrderDays(
                                          activeRequestsToUpdate.newStartDate,
                                          activeRequestsToUpdate.newEndDate
                                        ) *
                                          activeRequestsToUpdate.newPricePerDay
                                      )
                                    : moneyFormat(
                                        getFactOrderDays(
                                          order.offerStartDate,
                                          order.offerEndDate
                                        ) * order.offerPricePerDay
                                      )
                                }
                                inputClassName="form-input w-full"
                              />
                            </div>
                          </div>

                          <div className="flex w-full gap-2">
                            <div className="w-full sm:w-1/2">
                              <InputView
                                name="owner_fee"
                                label="Owner Fee, %"
                                placeholder="Owner Fee"
                                labelClassName="block text-sm font-medium mb-1"
                                value={order.ownerFee}
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-full sm:w-1/2">
                              <InputView
                                name="tenant_fee"
                                label="Renter Fee, %"
                                placeholder="Renter Fee"
                                labelClassName="block text-sm font-medium mb-1"
                                value={order.tenantFee}
                                inputClassName="form-input w-full"
                              />
                            </div>
                          </div>

                          <div className="flex w-full gap-2">
                            <div className="w-full sm:w-1/2">
                              <InputView
                                name="owner_total_fee"
                                label="Owner Total Fee, $"
                                placeholder="Owner Fee"
                                labelClassName="block text-sm font-medium mb-1"
                                value={
                                  activeRequestsToUpdate
                                    ? (order.ownerFee *
                                        getFactOrderDays(
                                          activeRequestsToUpdate.newStartDate,
                                          activeRequestsToUpdate.newEndDate
                                        ) *
                                        activeRequestsToUpdate.newPricePerDay) /
                                      100
                                    : (order.ownerFee *
                                        getFactOrderDays(
                                          order.offerStartDate,
                                          order.offerEndDate
                                        ) *
                                        order.offerPricePerDay) /
                                      100
                                }
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-full sm:w-1/2">
                              <InputView
                                name="tenant_total_fee"
                                label="Renter Total Fee, $"
                                placeholder="Renter Fee"
                                labelClassName="block text-sm font-medium mb-1"
                                value={
                                  activeRequestsToUpdate
                                    ? (order.tenantFee *
                                        getFactOrderDays(
                                          activeRequestsToUpdate.newStartDate,
                                          activeRequestsToUpdate.newEndDate
                                        ) *
                                        activeRequestsToUpdate.newPricePerDay) /
                                      100
                                    : (order.tenantFee *
                                        getFactOrderDays(
                                          order.offerStartDate,
                                          order.offerEndDate
                                        ) *
                                        order.offerPricePerDay) /
                                      100
                                }
                                inputClassName="form-input w-full"
                              />
                            </div>
                          </div>

                          <div className="flex w-full gap-2">
                            <div className="w-full sm:w-1/2">
                              <InputView
                                name="owner_price"
                                label="Owner Get Total Price, $"
                                placeholder="Owner Get Total Price"
                                labelClassName="block text-sm font-medium mb-1"
                                value={
                                  activeRequestsToUpdate
                                    ? moneyFormat(
                                        ownerGetsCalculate(
                                          activeRequestsToUpdate.newStartDate,
                                          activeRequestsToUpdate.newEndDate,
                                          order.ownerFee,
                                          activeRequestsToUpdate.newPricePerDay
                                        )
                                      )
                                    : moneyFormat(
                                        ownerGetsCalculate(
                                          order.offerStartDate,
                                          order.offerEndDate,
                                          order.ownerFee,
                                          order.offerPricePerDay
                                        )
                                      )
                                }
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-full sm:w-1/2">
                              <InputView
                                name="tenant_price"
                                label="Renter Send Total Price, $"
                                placeholder="Renter Send Total Price"
                                labelClassName="block text-sm font-medium mb-1"
                                value={
                                  activeRequestsToUpdate
                                    ? moneyFormat(
                                        tenantPaymentCalculate(
                                          activeRequestsToUpdate.newStartDate,
                                          activeRequestsToUpdate.newEndDate,
                                          order.tenantFee,
                                          activeRequestsToUpdate.newPricePerDay
                                        )
                                      )
                                    : moneyFormat(
                                        tenantPaymentCalculate(
                                          order.offerStartDate,
                                          order.offerEndDate,
                                          order.tenantFee,
                                          order.offerPricePerDay
                                        )
                                      )
                                }
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
                                value={order.listingCity}
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-full mb-2">
                              <InputView
                                name="postcode"
                                label="Postcode"
                                placeholder="e.g. 55 County Laois"
                                labelClassName="block text-sm font-medium mb-1"
                                value={order.listingPostcode}
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-full mb-2">
                              <InputView
                                name="address"
                                label="Address"
                                placeholder="e.g. 55 County Laois"
                                labelClassName="block text-sm font-medium mb-1"
                                value={order.listingAddress}
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
                                    lat: order.listingRentalLat,
                                    lng: order.listingRentalLng,
                                    radius: order.rentalRadius,
                                  },
                                ]}
                                baseCenter={{
                                  lat: order.listingRentalLat,
                                  lng: order.listingRentalLng,
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
                          className="flex flex-wrap mt-2"
                          style={{ width: "100%", gap: "0.5rem" }}
                        >
                          {listingImages.map((image) => (
                            <ListingPhotoView
                              key={image.id}
                              src={getListingImageByType(
                                image.link,
                                image.type
                              )}
                            />
                          ))}
                        </div>
                      </section>

                      <section>
                        <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                          Item Description
                        </h2>

                        <div className="w-full">
                          <TextareaView
                            name="description"
                            value={order.listingDescription}
                            row="7"
                          />
                        </div>
                      </section>

                      {requestsToUpdate.length > 0 && (
                        <section>
                          <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                            Previous Proposal
                          </h2>

                          <PreviousProposalElem
                            index={0}
                            prevStartDate={
                              order.prevStartDate ?? order.offerStartDate
                            }
                            prevEndDate={
                              order.prevEndDate ?? order.offerEndDate
                            }
                            prevPricePerDay={
                              order.prevPricePerDay ?? order.offerPricePerDay
                            }
                            prevTotalPrice={calculateCurrentTotalPrice({
                              isOwner: false,
                              startDate:
                                order.prevStartDate ?? order.offerStartDate,
                              endDate: order.prevEndDate ?? order.offerEndDate,
                              pricePerDay:
                                order.prevPricePerDay ?? order.offerPricePerDay,
                              ownerFee: order.ownerFee,
                              tenantFee: order.tenantFee,
                            })}
                            prevSenderName={order.tenantName}
                            prevGetterName={order.ownerName}
                            needBottomMargin={true}
                          />

                          {requestsToUpdate.map((request, index) => (
                            <PreviousProposalElem
                              key={request.id}
                              index={index + 1}
                              prevStartDate={request.newStartDate}
                              prevEndDate={request.newEndDate}
                              prevPricePerDay={request.newPricePerDay}
                              prevTotalPrice={calculateCurrentTotalPrice({
                                isOwner: false,
                                startDate: request.newStartDate,
                                endDate: request.newEndDate,
                                pricePerDay: request.newPricePerDay,
                                ownerFee: order.ownerFee,
                                tenantFee: request.newFee,
                              })}
                              prevSenderName={
                                request.senderId == order.tenantId
                                  ? order.tenantName
                                  : order.ownerName
                              }
                              prevGetterName={
                                request.senderId == order.tenantId
                                  ? order.ownerName
                                  : order.tenantName
                              }
                              needBottomMargin={
                                index != requestsToUpdate.length - 1
                              }
                            />
                          ))}
                        </section>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {order.tenantChecklistId && (
                <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
                  <div className="flex flex-col md:flex-row md:-mr-px">
                    <div className="grow w-full">
                      <div className="p-6 space-y-6">
                        <section className="flex w-full">
                          <div
                            className={
                              "w-full" + order.ownerChecklistId ? "mb-4" : ""
                            }
                          >
                            <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                              Checklist by renter
                            </h2>

                            <div className="w-full mb-2">
                              <TextareaView
                                label="Can you confirm the that the item matches the description provided in the listing?"
                                name="tenantChecklistItemMatchesDescription"
                                value={
                                  order.tenantChecklistItemMatchesDescription ||
                                  "-"
                                }
                                row="4"
                                labelClassName="block text-sm font-medium mb-1"
                              />
                            </div>

                            <div
                              className="flex flex-wrap mt-5"
                              style={{ width: "100%", gridGap: "0.5rem" }}
                            >
                              <label className="block text-sm font-medium mb-1">
                                Please upload clear, date stamped photos of the
                                item within the last 24 hours, highlighting all
                                sides and any existing damage or imperfections
                                and also showing the serial number.
                              </label>

                              {order.ownerChecklistsImages.map(
                                (image, index) => (
                                  <ListingPhotoView
                                    key={index}
                                    src={getFilePath(image.link)}
                                  />
                                )
                              )}
                            </div>

                            <div className="w-full mb-2">
                              <TextareaView
                                label="Do the photos provided accurately represent the current state of the item?"
                                name="tenantChecklistItemMatchesPhotos"
                                value={
                                  order.tenantChecklistItemMatchesPhotos || "-"
                                }
                                row="4"
                                labelClassName="block text-sm font-medium mb-1"
                              />
                            </div>

                            <div className="w-full mb-2">
                              <TextareaView
                                label="Can you confirm that the item is fully functional and meets the described specifications?"
                                name="tenantChecklistItemFullyFunctional"
                                value={
                                  order.tenantChecklistItemFullyFunctional ||
                                  "-"
                                }
                                row="4"
                                labelClassName="block text-sm font-medium mb-1"
                              />
                            </div>

                            <div className="w-full mb-2">
                              <TextareaView
                                label="Are all the listed accessories and parts present and in good condition?"
                                name="tenantChecklistPartsGoodCondition"
                                value={
                                  order.tenantChecklistPartsGoodCondition || "-"
                                }
                                row="4"
                                labelClassName="block text-sm font-medium mb-1"
                              />
                            </div>

                            <div className="w-full mb-2">
                              <TextareaView
                                label="Do you understand how to use the item properly and follow the provided guidelines?"
                                name="tenantChecklistProvidedGuidelines"
                                value={
                                  order.tenantChecklistProvidedGuidelines || "-"
                                }
                                row="4"
                                labelClassName="block text-sm font-medium mb-1"
                              />
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {order.ownerChecklistId && (
                <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
                  <div className="flex flex-col md:flex-row md:-mr-px">
                    <div className="grow w-full">
                      <div className="p-6 space-y-6">
                        <section className="flex w-full">
                          <div className="w-full">
                            <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                              Checklist by owner
                            </h2>

                            <div className="w-full mb-2">
                              <TextareaView
                                label="Can you confirm the that the item matches the description provided in the listing?"
                                name="ownerChecklistItemMatchesDescription"
                                value={
                                  order.ownerChecklistItemMatchesDescription ||
                                  "-"
                                }
                                row="4"
                                labelClassName="block text-sm font-medium mb-1"
                              />
                            </div>

                            <div
                              className="flex flex-wrap mt-5"
                              style={{ width: "100%", gridGap: "0.5rem" }}
                            >
                              <label className="block text-sm font-medium mb-1">
                                Please upload clear, date stamped photos of the
                                item within the last 24 hours, highlighting all
                                sides and any existing damage or imperfections
                                and also showing the serial number.
                              </label>

                              {order.tenantChecklistsImages.map(
                                (image, index) => (
                                  <ListingPhotoView
                                    key={index}
                                    src={getFilePath(image.link)}
                                  />
                                )
                              )}
                            </div>

                            <div className="w-full mb-2">
                              <TextareaView
                                label="Do the photos provided accurately represent the current state of the item?"
                                name="ownerChecklistItemMatchesPhotos"
                                value={
                                  order.ownerChecklistItemMatchesPhotos || "-"
                                }
                                row="4"
                                labelClassName="block text-sm font-medium mb-1"
                              />
                            </div>

                            <div className="w-full mb-2">
                              <TextareaView
                                label="Can you confirm that the item is fully functional and meets the described specifications?"
                                name="ownerChecklistItemFullyFunctional"
                                value={
                                  order.ownerChecklistItemFullyFunctional || "-"
                                }
                                row="4"
                                labelClassName="block text-sm font-medium mb-1"
                              />
                            </div>

                            <div className="w-full mb-2">
                              <TextareaView
                                label="Are all the listed accessories and parts present and in good condition?"
                                name="ownerChecklistPartsGoodCondition"
                                value={
                                  order.ownerChecklistPartsGoodCondition || "-"
                                }
                                row="4"
                                labelClassName="block text-sm font-medium mb-1"
                              />
                            </div>

                            <div className="w-full mb-2">
                              <TextareaView
                                label="Do you understand how to use the item properly and follow the provided guidelines?"
                                name="ownerChecklistProvidedGuidelines"
                                value={
                                  order.ownerChecklistProvidedGuidelines || "-"
                                }
                                labelClassName="block text-sm font-medium mb-1"
                                row="4"
                              />
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const boostServerSideProps = async ({ context, baseSideProps }) => {
  const id = context.params.id;
  const options = await getAdminOrderInfo(id, baseSideProps.authToken);
  return { ...options, id, pageTitle: `Order #${id}` };
};

export const getServerSideProps = (context) =>
  supportSideProps({ context, callback: boostServerSideProps });

export default Order;
