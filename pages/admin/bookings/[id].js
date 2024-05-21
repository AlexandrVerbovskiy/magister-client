import { adminSideProps, supportSideProps } from "../../../middlewares";
import { getAdminBookingInfo } from "../../../services";
import { useAdminPage } from "../../../hooks";
import Sidebar from "../../../partials/admin/Sidebar";
import Header from "../../../partials/admin/Header";
import BreadCrumbs from "../../../partials/admin/base/BreadCrumbs";
import ListingPhotoView from "../../../components/admin/Listings/PhotoPopupView";
import {
  getDaysDifference,
  getListingImageByType,
  moneyFormat,
  ownerGetsCalculate,
  tenantPaymentCalculate,
} from "../../../utils";
import { useContext, useState } from "react";
import MultyMarkersMap from "../../../components/Listings/MultyMarkersMap";
import InputView from "../../../components/admin/Form/InputView";
import TextareaView from "../../../components/admin/Form/TextareaView";
import Status from "../../../components/admin/Bookings/Status";
import { IndiceContext } from "../../../contexts";

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

const Booking = (booking) => {
  const { requestsToUpdate, listingImages, categoryInfo } = booking;
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
              <div className="sm:flex sm:justify-between sm:items-center mb-8">
                <BreadCrumbs
                  links={[
                    { title: "Bookings", href: "/admin/bookings" },
                    { title: "#" + booking.id },
                  ]}
                />
              </div>

              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
                <div className="flex flex-col md:flex-row md:-mr-px">
                  <div className="grow w-full">
                    <div className="p-6 space-y-6">
                      <h2 className="flex text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5 justify-between">
                        <div className="order-form-title">{`Booking a ${booking.listingName} by ${booking.tenantName}`}</div>
                        <Status
                          status={booking.status}
                          baseClass="form-input w-max ml-2"
                        />
                      </h2>

                      <section>
                        <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                          Base information
                        </h2>

                        <div className="flex flex-col gap-2">
                          <div className="flex w-full gap-2">
                            <div className="w-full sm:w-1/2">
                              <InputView
                                value={booking.listingName}
                                label="User Name"
                                name="name"
                                placeholder="Name of tool"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-1/2">
                              <InputView
                                value={booking.listingCategoryName}
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
                                value={booking.ownerName}
                                label="Listing Owner"
                                name="owner"
                                placeholder="Owner Name"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-1/2">
                              <InputView
                                value={booking.tenantName}
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
                                    : booking.offerStartDate
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
                                    : booking.offerEndDate
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
                                    : booking.offerPricePerDay
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
                                        getDaysDifference(
                                          activeRequestsToUpdate.newStartDate,
                                          activeRequestsToUpdate.newEndDate
                                        ) *
                                          activeRequestsToUpdate.newPricePerDay
                                      )
                                    : moneyFormat(
                                        getDaysDifference(
                                          booking.offerStartDate,
                                          booking.offerEndDate
                                        ) * booking.offerPricePerDay
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
                                value={booking.ownerFee}
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-full sm:w-1/2">
                              <InputView
                                name="tenant_fee"
                                label="Tenant Fee, %"
                                placeholder="Tenant Fee"
                                labelClassName="block text-sm font-medium mb-1"
                                value={booking.tenantFee}
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
                                    ? (booking.ownerFee *
                                        getDaysDifference(
                                          activeRequestsToUpdate.newStartDate,
                                          activeRequestsToUpdate.newEndDate
                                        ) *
                                        activeRequestsToUpdate.newPricePerDay) /
                                      100
                                    : (booking.ownerFee *
                                        getDaysDifference(
                                          booking.offerStartDate,
                                          booking.offerEndDate
                                        ) *
                                        booking.offerPricePerDay) /
                                      100
                                }
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-full sm:w-1/2">
                              <InputView
                                name="tenant_total_fee"
                                label="Tenant Total Fee, $"
                                placeholder="Tenant Fee"
                                labelClassName="block text-sm font-medium mb-1"
                                value={
                                  activeRequestsToUpdate
                                    ? (booking.tenantFee *
                                        getDaysDifference(
                                          activeRequestsToUpdate.newStartDate,
                                          activeRequestsToUpdate.newEndDate
                                        ) *
                                        activeRequestsToUpdate.newPricePerDay) /
                                      100
                                    : (booking.tenantFee *
                                        getDaysDifference(
                                          booking.offerStartDate,
                                          booking.offerEndDate
                                        ) *
                                        booking.offerPricePerDay) /
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
                                          booking.ownerFee,
                                          activeRequestsToUpdate.newPricePerDay
                                        )
                                      )
                                    : moneyFormat(
                                        ownerGetsCalculate(
                                          booking.offerStartDate,
                                          booking.offerEndDate,
                                          booking.ownerFee,
                                          booking.offerPricePerDay
                                        )
                                      )
                                }
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-full sm:w-1/2">
                              <InputView
                                name="tenant_price"
                                label="Tenant Send Total Price, $"
                                placeholder="Tenant Send Total Price"
                                labelClassName="block text-sm font-medium mb-1"
                                value={
                                  activeRequestsToUpdate
                                    ? moneyFormat(
                                        tenantPaymentCalculate(
                                          activeRequestsToUpdate.newStartDate,
                                          activeRequestsToUpdate.newEndDate,
                                          booking.tenantFee,
                                          activeRequestsToUpdate.newPricePerDay
                                        )
                                      )
                                    : moneyFormat(
                                        tenantPaymentCalculate(
                                          booking.offerStartDate,
                                          booking.offerEndDate,
                                          booking.tenantFee,
                                          booking.offerPricePerDay
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
                                value={booking.listingCity}
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-full sm:w-1/2">
                              <InputView
                                name="postcode"
                                label="Postcode"
                                placeholder="e.g. 55 County Laois"
                                labelClassName="block text-sm font-medium mb-1"
                                value={booking.listingPostcode}
                                inputClassName="form-input w-full"
                              />
                            </div>
                          </div>

                          <div className="w-full">
                            <InputView
                              name="address"
                              label="Address"
                              placeholder="e.g. 55 County Laois"
                              labelClassName="block text-sm font-medium mb-1"
                              value={booking.listingAddress}
                              inputClassName="form-input w-full"
                            />
                          </div>

                          <div
                            className="flex w-full admin-map-parent"
                            style={{ height: "500px" }}
                          >
                            <MultyMarkersMap
                              userLocation={userLocation}
                              setUserLocation={setUserLocation}
                              markers={[
                                {
                                  id: 1,
                                  lat: booking.listingRentalLat,
                                  lng: booking.listingRentalLng,
                                  radius: booking.rentalRadius,
                                },
                              ]}
                              baseCenter={{
                                lat: booking.listingRentalLat,
                                lng: booking.listingRentalLng,
                              }}
                              center={mapCenter}
                              setCenter={setMapCenter}
                            />
                          </div>
                        </div>
                      </section>

                      {(booking.defects.length > 0 ||
                        booking.listingDopDefect) && (
                        <section>
                          <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                            Defects
                          </h2>

                          <div className="flex flex-col gap-2">
                            {booking.defects.map((defect) => (
                              <div className="w-full" key={defect.defectId}>
                                <InputView
                                  labelClassName="block text-sm font-medium mb-1"
                                  value={defect.defectName}
                                  inputClassName="form-input w-full"
                                />
                              </div>
                            ))}

                            {booking.listingDopDefect && (
                              <div className="col-12">
                                <InputView
                                  labelClassName="block text-sm font-medium mb-1"
                                  value={booking.listingDopDefect}
                                  inputClassName="form-input w-full"
                                />
                              </div>
                            )}
                          </div>
                        </section>
                      )}

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
                          Listing Details
                        </h2>

                        <div className="w-full">
                          <TextareaView
                            name="description"
                            value={booking.listingDescription}
                            row="7"
                          />
                        </div>
                      </section>

                      <section>
                        <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                          Listing Rental Terms
                        </h2>

                        <div className="w-full">
                          <TextareaView
                            name="rentalTerms"
                            value={booking.listingRentalTerms}
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
                              booking.prevStartDate ?? booking.offerStartDate
                            }
                            prevEndDate={
                              booking.prevEndDate ?? booking.offerEndDate
                            }
                            prevPricePerDay={
                              booking.prevPricePerDay ??
                              booking.offerPricePerDay
                            }
                            prevTotalPrice={
                              booking.prevFactTotalPrice ??
                              booking.factTotalPrice
                            }
                            prevSenderName={booking.tenantName}
                            prevGetterName={booking.ownerName}
                            needBottomMargin={true}
                          />

                          {requestsToUpdate.map((request, index) => (
                            <PreviousProposalElem
                              key={request.id}
                              index={index + 1}
                              prevStartDate={request.newStartDate}
                              prevEndDate={request.newEndDate}
                              prevPricePerDay={request.newPricePerDay}
                              prevTotalPrice={request.newFactTotalPrice}
                              prevSenderName={
                                request.senderId == booking.tenantId
                                  ? booking.tenantName
                                  : booking.ownerName
                              }
                              prevGetterName={
                                request.senderId == booking.tenantId
                                  ? booking.ownerName
                                  : booking.tenantName
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const boostServerSideProps = async ({ context, baseSideProps }) => {
  const id = context.params.id;
  const options = await getAdminBookingInfo(id, baseSideProps.authToken);
  return { ...options, id };
};

export const getServerSideProps = (context) =>
  supportSideProps(context, boostServerSideProps);

export default Booking;
