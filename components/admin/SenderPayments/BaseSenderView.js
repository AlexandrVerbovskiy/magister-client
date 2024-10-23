import { useContext, useState } from "react";
import { useAdminPage } from "../../../hooks";
import Header from "../../../partials/admin/Header";
import Sidebar from "../../../partials/admin/Sidebar";
import BreadCrumbs from "../../../partials/admin/base/BreadCrumbs";
import {
  approveSenderPaymentTransaction,
  rejectSenderPaymentTransaction,
} from "../../../services";
import {
  calculateTotalPriceByDaysCount,
  getFactOrderDays,
  getFilePath,
  moneyFormat,
  dateConverter,
  isPayedUsedPaypal,
  calculateFeeByDaysCount,
} from "../../../utils";
import InputView from "../Form/InputView";
import { IndiceContext } from "../../../contexts";
import { useRouter } from "next/router";
import ImageView from "../Form/ImageView";
import RejectModal from "./RejectModal";
import AcceptModal from "./AcceptModal";
import STATIC from "../../../static";

const BaseSenderView = ({ parentType = "senders", payment }) => {
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const { authToken, error, success } = useContext(IndiceContext);
  const [rejectedPopupActive, setRejectedPopupActive] = useState(false);
  const [approvedPopupActive, setApprovedPopupActive] = useState(false);
  const [openProofImage, setOpenProofImage] = useState(false);

  let parentName = "Senders";
  let parentLink = "/admin/payments/senders/";

  if (parentType == "failed-senders") {
    parentName = "Failed Paypal Payments";
    parentLink = "/admin/payments/failed-senders-paypal/";
  }

  const subtotalPrice = calculateTotalPriceByDaysCount(
    getFactOrderDays(payment.offerStartDate, payment.offerEndDate),
    payment.offerPricePerDay
  );

  const totalFee = calculateFeeByDaysCount(
    getFactOrderDays(payment.offerStartDate, payment.offerEndDate),
    payment.offerPricePerDay,
    payment.tenantFee,
    true
  );

  const handleAccept = async () => {
    await approveSenderPaymentTransaction(
      { orderId: payment.orderId },
      authToken
    );
    router.push(parentLink);
  };

  const handleRejectActivate = (e) => {
    e.stopPropagation();
    setRejectedPopupActive(true);
  };

  const handleAcceptActivate = (e) => {
    e.stopPropagation();
    setApprovedPopupActive(true);
  };

  const handleReject = async (description) => {
    await rejectSenderPaymentTransaction(
      { orderId: payment.orderId, description },
      authToken
    );
    router.push(parentLink);
  };

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
                        <div className="max-w-full overflow-separate order-form-title">{`Payment by ${payment.payerName}`}</div>
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
                                value={dateConverter(payment.offerStartDate)}
                                label="Offer Start Date"
                                name="offer-start-date"
                                placeholder="Offer Start Date"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-1/2">
                              <InputView
                                value={dateConverter(payment.offerEndDate)}
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
                                label={`Offer Price (${STATIC.CURRENCY})`}
                                name="price"
                                placeholder="Offer Price"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-1/2">
                              <InputView
                                value={subtotalPrice}
                                label={`Offer Subtotal Price (${STATIC.CURRENCY})`}
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
                                label="Renter Fee (%)"
                                name="renter-fee"
                                placeholder="Renter Fee"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-1/2">
                              <InputView
                                value={moneyFormat(subtotalPrice + totalFee)}
                                label={`Total To Pay (${STATIC.CURRENCY})`}
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

                          {payment.type ==
                            STATIC.PAYMENT_TYPES.BANK_TRANSFER && (
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

                          {isPayedUsedPaypal(payment.type) && (
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
                              type="button"
                              onClick={handleAcceptActivate}
                              className="btn bg-teal-500 hover:bg-teal-600 text-white ml-3"
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

          <RejectModal
            active={rejectedPopupActive}
            close={() => setRejectedPopupActive(false)}
            onRejectClick={handleReject}
          />

          <AcceptModal
            active={approvedPopupActive}
            close={() => setApprovedPopupActive(false)}
            onAcceptClick={handleAccept}
          />
        </main>
      </div>
    </div>
  );
};

export default BaseSenderView;
