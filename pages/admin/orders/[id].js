import { adminSideProps, supportSideProps } from "../../../middlewares";
import { getAdminOrderInfo } from "../../../services";
import { useAdminPage } from "../../../hooks";
import Sidebar from "../../../partials/admin/Sidebar";
import Header from "../../../partials/admin/Header";
import BreadCrumbs from "../../../partials/admin/base/BreadCrumbs";
import ListingPhotoView from "../../../components/admin/Listings/PhotoPopupView";

const Order = (order) => {
  const { listingImages, categoryInfo } = order;
  const { sidebarOpen, setSidebarOpen } = useAdminPage();

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
                    { title: "Orders", href: "/admin/orders" },
                    { title: "#" + order.id },
                  ]}
                />
              </div>

              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
                <div className="flex flex-col md:flex-row md:-mr-px">
                  <div className="grow w-full">
                    <div className="p-6 space-y-6">
                      <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5">
                        Rent a {order.listingName} by {order.tenantName}
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
                                value={order.listingCategoryName}
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

                          <div className="flex w-full gap-2">
                            <div className="w-full sm:w-1/2">
                              <label className="block text-sm font-medium mb-1">
                                Order Status
                              </label>
                              <Status
                                status={order.status}
                                baseClass="form-input w-full"
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
                                value={order.offerStartDate}
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-full sm:w-1/2">
                              <InputView
                                name="to_date"
                                label="To Date"
                                placeholder="To Date"
                                labelClassName="block text-sm font-medium mb-1"
                                value={order.offerEndDate}
                                inputClassName="form-input w-full"
                              />
                            </div>
                          </div>

                          <div className="flex w-full gap-2">
                            <div className="w-full sm:w-1/2">
                              <InputView
                                name="price_per_day"
                                label="Price Per Day"
                                placeholder="Price Per Day"
                                labelClassName="block text-sm font-medium mb-1"
                                value={order.offerPricePerDay}
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-full sm:w-1/2">
                              <InputView
                                name="total_price"
                                label="Total Price"
                                placeholder="Total Price"
                                labelClassName="block text-sm font-medium mb-1"
                                value={order.factTotalPrice}
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
                                value={order.listingCity}
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-full sm:w-1/2">
                              <InputView
                                name="postcode"
                                label="Postcode"
                                placeholder="e.g. 55 County Laois"
                                labelClassName="block text-sm font-medium mb-1"
                                value={order.listingPostcode}
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
                              value={order.listingAddress}
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
                      </section>

                      {order.defects.length > 0 && (
                        <section>
                          <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                            Defects
                          </h2>

                          <div className="flex flex-col gap-2">
                            {order.defects.map((defect) => (
                              <div className="w-full" key={defect.defectId}>
                                <InputView
                                  labelClassName="block text-sm font-medium mb-1"
                                  value={defect.defectName}
                                  inputClassName="form-input w-full"
                                />
                              </div>
                            ))}
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
                            value={order.listingDescription}
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
                            value={order.listingRentalTerms}
                            row="7"
                          />
                        </div>
                      </section>
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
  return { ...options, id };
};

export const getServerSideProps = (context) =>
  supportSideProps(context, boostServerSideProps);

export default Order;
