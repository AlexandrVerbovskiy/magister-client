import { supportSideProps } from "../../../middlewares";
import { getAdminOrderInfo } from "../../../services";
import { useAdminPage } from "../../../hooks";
import Sidebar from "../../../partials/admin/Sidebar";
import Header from "../../../partials/admin/Header";
import BreadCrumbs from "../../../partials/admin/base/BreadCrumbs";
import ListingPhotoView from "../../../components/admin/Listings/PhotoPopupView";
import {
  autoCalculateCurrentTotalPrice,
  getFilePath,
  getListingImageByType,
  moneyFormat,
  ownerEarnCalculate,
  renterPaysFeeCalculate,
  renterPaysCalculate,
  getPriceByDays,
} from "../../../utils";
import { useState } from "react";
import MultyMarkersMap from "../../../components/Listings/MultyMarkersMap";
import InputView from "../../../components/admin/Form/InputView";
import TextareaView from "../../../components/admin/Form/TextareaView";
import Status from "../../../components/admin/Orders/Status";
import CancelStatus from "../../../components/admin/Orders/CancelStatus";
import { useIdPage } from "../../../hooks";
import STATIC from "../../../static";

const PreviousProposalElem = ({
  index,
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
                        <div className="order-form-title max-w-full overflow-separate">{`Order a ${order.listingName} by ${order.renterName}`}</div>
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
                                placeholder="Name"
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
                                value={order.renterName}
                                label="Renter"
                                placeholder="Renter Name"
                                name="renter"
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
                                name="total_price"
                                label={`Total Price (${STATIC.CURRENCY})`}
                                placeholder="Total Price"
                                labelClassName="block text-sm font-medium mb-1"
                                value={
                                  activeRequestsToUpdate
                                    ? moneyFormat(
                                        activeRequestsToUpdate.newPrice
                                      )
                                    : moneyFormat(order.offerPrice)
                                }
                                inputClassName="form-input w-full"
                              />
                            </div>
                          </div>

                          <div className="flex w-full gap-2">
                            <div className="w-full sm:w-1/2">
                              <InputView
                                name="owner_fee"
                                label="Owner Fee (%)"
                                placeholder="Owner Fee"
                                labelClassName="block text-sm font-medium mb-1"
                                value={order.ownerFee}
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-full sm:w-1/2">
                              <InputView
                                name="renter_fee"
                                label="Renter Fee (%)"
                                placeholder="Renter Fee"
                                labelClassName="block text-sm font-medium mb-1"
                                value={order.renterFee}
                                inputClassName="form-input w-full"
                              />
                            </div>
                          </div>

                          <div className="flex w-full gap-2">
                            <div className="w-full sm:w-1/2">
                              <InputView
                                name="owner_total_fee"
                                label={`Owner Total Fee (${STATIC.CURRENCY})`}
                                placeholder="Owner Fee"
                                labelClassName="block text-sm font-medium mb-1"
                                value={
                                  activeRequestsToUpdate
                                    ? ownerEarnCalculate(
                                        getPriceByDays(
                                          activeRequestsToUpdate.newPrice,
                                          activeRequestsToUpdate.newStartDate,
                                          activeRequestsToUpdate.newFinishDate
                                        ),
                                        order.ownerFee
                                      )
                                    : ownerEarnCalculate(
                                        getPriceByDays(
                                          order.offerPrice,
                                          order.offerStartDate,
                                          order.offerFinishDate
                                        ),
                                        order.ownerFee
                                      )
                                }
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-full sm:w-1/2">
                              <InputView
                                name="renter_total_fee"
                                label={`Renter Total Fee (${STATIC.CURRENCY})`}
                                placeholder="Renter Fee"
                                labelClassName="block text-sm font-medium mb-1"
                                value={
                                  activeRequestsToUpdate
                                    ? renterPaysFeeCalculate(
                                        getPriceByDays(
                                          activeRequestsToUpdate.newPrice,
                                          activeRequestsToUpdate.newStartDate,
                                          activeRequestsToUpdate.newFinishDate
                                        ),
                                        order.renterFee
                                      )
                                    : renterPaysFeeCalculate(
                                        getPriceByDays(
                                          order.offerPrice,
                                          order.offerStartDate,
                                          order.offerFinishDate
                                        ),
                                        order.offerPrice,
                                        order.renterFee
                                      )
                                }
                                inputClassName="form-input w-full"
                              />
                            </div>
                          </div>

                          <div className="flex w-full gap-2">
                            <div className="w-full sm:w-1/2">
                              <InputView
                                name="owner_price"
                                label={`Owner Get Total Price (${STATIC.CURRENCY})`}
                                placeholder="Owner Get Total Price"
                                labelClassName="block text-sm font-medium mb-1"
                                value={
                                  activeRequestsToUpdate
                                    ? moneyFormat(
                                        ownerEarnCalculate(
                                          getPriceByDays(
                                            activeRequestsToUpdate.newPrice,
                                            activeRequestsToUpdate.newStartDate,
                                            activeRequestsToUpdate.newFinishDate
                                          ),
                                          order.ownerFee
                                        )
                                      )
                                    : moneyFormat(
                                        ownerEarnCalculate(
                                          getPriceByDays(
                                            order.offerPrice,
                                            order.offerStartDate,
                                            order.offerFinishDate
                                          ),
                                          order.ownerFee
                                        )
                                      )
                                }
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-full sm:w-1/2">
                              <InputView
                                name="renter_price"
                                label={`Renter Send Total Price (${STATIC.CURRENCY})`}
                                placeholder="Renter Send Total Price"
                                labelClassName="block text-sm font-medium mb-1"
                                value={
                                  activeRequestsToUpdate
                                    ? moneyFormat(
                                        renterPaysCalculate(
                                          getPriceByDays(
                                            activeRequestsToUpdate.newPrice,
                                            activeRequestsToUpdate.newStartDate,
                                            activeRequestsToUpdate.newFinishDate
                                          ),
                                          order.renterFee
                                        )
                                      )
                                    : moneyFormat(
                                        renterPaysCalculate(
                                          getPriceByDays(
                                            order.offerPrice,
                                            order.offerStartDate,
                                            order.offerFinishDate
                                          ),
                                          order.renterFee
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
                                    lat: order.listingLat,
                                    lng: order.listingLng,
                                    radius: order.radius,
                                  },
                                ]}
                                baseCenter={{
                                  lat: order.listingLat,
                                  lng: order.listingLng,
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
                            prevPrice={order.prevPrice ?? order.offerPrice}
                            prevTotalPrice={autoCalculateCurrentTotalPrice({
                              isOwner: false,
                              price: getPriceByDays(
                                order.prevPrice ?? order.offerPrice,
                                order.prevStartDate ?? order.offerStartDate,
                                order.prevFinishDate ?? order.offerFinishDate
                              ),
                              ownerFee: order.ownerFee,
                              renterFee: order.renterFee,
                            })}
                            prevSenderName={order.renterName}
                            prevGetterName={order.ownerName}
                            needBottomMargin={true}
                          />

                          {requestsToUpdate.map((request, index) => (
                            <PreviousProposalElem
                              key={request.id}
                              index={index + 1}
                              prevPrice={request.newPrice}
                              prevTotalPrice={autoCalculateCurrentTotalPrice({
                                isOwner: false,
                                price: request.newPrice,
                                price: getPriceByDays(
                                  request.newPrice,
                                  request.newStartDate,
                                  request.newFinishDate
                                ),
                                ownerFee: order.ownerFee,
                                renterFee: order.renterFee,
                              })}
                              prevSenderName={
                                request.senderId == order.renterId
                                  ? order.renterName
                                  : order.ownerName
                              }
                              prevGetterName={
                                request.senderId == order.renterId
                                  ? order.ownerName
                                  : order.renterName
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
  const options = await getAdminOrderInfo(id, baseSideProps.authToken);
  return { ...options, id, pageTitle: `Order #${id}` };
};

export const getServerSideProps = (context) =>
  supportSideProps({ context, callback: boostServerSideProps });

export default Order;
