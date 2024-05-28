import { useContext, useState } from "react";
import { useAdminPage } from "../../hooks";
import Header from "../../partials/admin/Header";
import Sidebar from "../../partials/admin/Sidebar";
import BreadCrumbs from "../../partials/admin/base/BreadCrumbs";
import {
  approveSenderPaymentTransaction,
  rejectSenderPaymentTransaction,
} from "../../services";
import {
  calculateTotalPriceByDaysCount,
  getDaysDifference,
  getFilePath,
  moneyFormat,
  timeConverter,
} from "../../utils";
import InputView from "./Form/InputView";
import { IndiceContext } from "../../contexts";
import { useRouter } from "next/router";
import ImageView from "./Form/ImageView";
import ModalWithDescription from "./Form/ModalWithDescription";
import YesNoModal from "./YesNoModal";

const BaseSenderView = ({ parentType = "senders", payment }) => {
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const [disabled, setDisabled] = useState(false);
  const { authToken, error, success } = useContext(IndiceContext);
  const [rejectedPopupActive, setRejectedPopupActive] = useState(false);
  const [approvedPopupActive, setApprovedPopupActive] = useState(false);
  const [openProofImage, setOpenProofImage] = useState(false);

  const [declineDescription, setDeclineDescription] = useState("");
  const [declineDescriptionError, setDeclineDescriptionError] = useState(null);

  const handleInputDeclineDescription = (e) => {
    setDeclineDescription(e.target.value);
    setDeclineDescriptionError(null);
  };

  let parentName = "Senders";
  let parentLink = "/admin/payments/senders";

  if (parentType == "waiting-approval-senders") {
    parentName = "Waiting Payment Approval";
    parentLink = "/admin/payments/senders-waiting-approval";
  }

  if(parentType == "failed-senders"){
    parentName = "Failed Paypal Payments";
    parentLink = "/admin/payments/failed-senders-paypal";
  }

  const subtotalPrice = calculateTotalPriceByDaysCount(
    getDaysDifference(payment.offerStartDate, payment.offerEndDate),
    payment.offerPricePerDay
  );

  const totalFee = (subtotalPrice * payment.tenantFee) / 100;

  const handleAccept = async () => {
    try {
      await approveSenderPaymentTransaction(
        { orderId: payment.orderId },
        authToken
      );
      success.set("Payment approved successfully");
      router.push(parentLink);
      setApprovedPopupActive(false);
    } catch (e) {
      error.set(e.message);
    }
  };

  const handleRejectActivate = (e) => {
    e.stopPropagation();
    setRejectedPopupActive(true);
  };

  const handleAcceptActivate = (e) => {
    e.stopPropagation();
    setApprovedPopupActive(true);
  };

  const handleReject = async () => {
    try {
      await rejectSenderPaymentTransaction(
        { orderId: payment.orderId, description: declineDescription },
        authToken
      );
      success.set("Payment rejected successfully");
      router.push(parentLink);
      setRejectedPopupActive(false);
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
                <BreadCrumbs
                  links={[
                    {
                      title: parentName,
                      href: parentLink,
                    },
                    { title: "#" + payment.id },
                  ]}
                />
              </div>

              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
                <div className="flex flex-col md:flex-row md:-mr-px">
                  <div className="grow w-full">
                    <div className="p-6 space-y-6">
                      <h2 className="flex text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5 justify-between">
                        <div className="order-form-title">{`Payment by ${payment.payerName}`}</div>
                      </h2>

                      <section>
                        <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                          Base information
                        </h2>

                        <div className="flex flex-col gap-2">
                          <div className="flex w-full gap-2">
                            <div className="w-full sm:w-1/2">
                              <InputView
                                value={payment.payerName}
                                label="Payer Name"
                                name="payer-name"
                                placeholder="Payer Name"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-1/2">
                              <InputView
                                value={payment.orderId}
                                label="Order ID"
                                placeholder="Order ID"
                                name="order-id"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>
                          </div>

                          <div className="flex w-full gap-2">
                            <div className="w-full sm:w-1/2">
                              <InputView
                                value={payment.listingName}
                                label="Listing Name"
                                name="listing-name"
                                placeholder="Listing Name"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-1/2">
                              <InputView
                                value={payment.ownerName}
                                label="Owner Name"
                                placeholder="Owner Name"
                                name="owner-name"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </section>

                      <section>
                        <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                          Pay information
                        </h2>

                        <div className="flex flex-col gap-2">
                          <div className="flex w-full gap-2">
                            <div className="w-full sm:w-1/2">
                              <InputView
                                value={timeConverter(payment.offerStartDate)}
                                label="Offer Start Date"
                                name="offer-start-date"
                                placeholder="Offer Start Date"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-1/2">
                              <InputView
                                value={timeConverter(payment.offerEndDate)}
                                label="Offer End Name"
                                placeholder="Offer End Name"
                                name="offer-end-date"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>
                          </div>

                          <div className="flex w-full gap-2">
                            <div className="w-full sm:w-1/2">
                              <InputView
                                value={moneyFormat(payment.offerPricePerDay)}
                                label="Offer Price Per Day, $"
                                name="price-per-day"
                                placeholder="Offer Price Per Day"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-1/2">
                              <InputView
                                value={subtotalPrice}
                                label="Offer Subtotal Price, $"
                                placeholder="Offer Subtotal Price"
                                name="order-subtotal"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>
                          </div>

                          <div className="flex w-full gap-2">
                            <div className="w-full sm:w-1/2">
                              <InputView
                                value={payment.tenantFee}
                                label="Renter Fee, %"
                                name="renter-fee"
                                placeholder="Renter Fee"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-1/2">
                              <InputView
                                value={moneyFormat(subtotalPrice + totalFee)}
                                label="Total To Pay, $"
                                placeholder="Total To Pay"
                                name="total-to-pay"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </section>

                      {!payment.waitingApproved && !payment.adminApproved && (
                        <section>
                          <div className="p-2 rounded bg-rose-100 dark:bg-rose-400/30 border-rose-200 dark:border-transparent text-rose-600 dark:text-rose-400">
                            {payment.failedDescription}
                          </div>
                        </section>
                      )}

                      {payment.waitingApproved && payment.data && (
                        <section>
                          <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                            Payment proof {payment.type}
                          </h2>

                          {payment.type == "credit-card" && (
                            <div className="flex flex-col gap-2">
                              <div className="flex w-full gap-2">
                                <div className="w-full sm:w-1/2">
                                  <div
                                    className="col-lg-4 col-md-6"
                                    style={{ cursor: "zoom-in" }}
                                    onClick={() => setOpenProofImage(true)}
                                  >
                                    <div className="single-image-bpx mt-2">
                                      <img
                                        className="max-w-96 max-h-96 w-auto h-auto"
                                        src={getFilePath(payment.payedProof)}
                                        alt={`${payment.listingName} image`}
                                      />
                                    </div>
                                  </div>

                                  <ImageView
                                    open={openProofImage}
                                    imgSrc={getFilePath(payment.payedProof)}
                                    close={() => setOpenProofImage(false)}
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {payment.type == "paypal" && (
                            <div className="flex flex-col gap-2">
                              <div className="flex w-full gap-2">
                                <div className="w-full sm:w-1/3">
                                  <InputView
                                    value={payment.data.paypalSenderId}
                                    label="Paypal Sender ID"
                                    name="paypal-sender-id"
                                    placeholder="Paypal Sender ID"
                                    labelClassName="block text-sm font-medium mb-1"
                                    inputClassName="form-input w-full"
                                  />
                                </div>

                                <div className="w-full sm:w-1/3">
                                  <InputView
                                    value={payment.data.paypalCaptureId}
                                    label="Paypal Capture ID"
                                    name="paypal-capture-id"
                                    placeholder="Paypal Capture ID"
                                    labelClassName="block text-sm font-medium mb-1"
                                    inputClassName="form-input w-full"
                                  />
                                </div>

                                <div className="w-full sm:w-1/3">
                                  <InputView
                                    value={payment.data.paypalOrderId}
                                    label="Paypal Order ID"
                                    name="paypal-order-id"
                                    placeholder="Paypal Order ID"
                                    labelClassName="block text-sm font-medium mb-1"
                                    inputClassName="form-input w-full"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </section>
                      )}
                    </div>

                    {payment.waitingApproved && (
                      <footer>
                        <div className="flex flex-col px-6 py-5 border-t border-slate-200 dark:border-slate-700">
                          <div className="flex self-end">
                            <button
                              onClick={handleRejectActivate}
                              className="btn bg-rose-500 hover:bg-rose-600 text-white"
                            >
                              Reject
                            </button>

                            <button
                              disabled={disabled}
                              type="button"
                              onClick={handleAcceptActivate}
                              className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3"
                            >
                              Approve
                            </button>
                          </div>
                        </div>
                      </footer>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ModalWithDescription
            accessModalOpen={rejectedPopupActive}
            setAccessModalOpen={setRejectedPopupActive}
            question="Are you sure you want mark this payment as failed?"
            descriptionLabel="Enter the reason for the reject"
            description={declineDescription}
            handleInputDescription={handleInputDeclineDescription}
            descriptionError={declineDescriptionError}
            handleAcceptClick={handleReject}
            acceptButtonText="Reject"
            disabled={disabled}
          />

          <YesNoModal
            title="Accept action"
            body="Are you sure you want to mark the payment as approved?"
            handleCloseModal={() => setApprovedPopupActive(false)}
            onAccept={handleAccept}
            modalOpen={approvedPopupActive}
            setModalOpen={setApprovedPopupActive}
            disabled={disabled}
          />
        </main>
      </div>
    </div>
  );
};

export default BaseSenderView;
