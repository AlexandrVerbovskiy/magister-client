import { useRouter } from "next/router";
import { waitingRefundMarkAsDone } from "../../services";
import { useAdminPage } from "../../hooks";
import { useContext, useState } from "react";
import { IndiceContext } from "../../contexts";
import {
  moneyFormat,
  workerPaymentCalculate,
  dateConverter,
  getPaymentNameByType,
  isPayedUsedPaypal,
  recipientStatuses,
} from "../../utils";
import Sidebar from "../../partials/admin/Sidebar";
import Header from "../../partials/admin/Header";
import BreadCrumbs from "../../partials/admin/base/BreadCrumbs";
import InputView from "./Form/InputView";
import AcceptModal from "./RecipientPayments/AcceptModal";
import STATIC from "../../static";
import StatusSpan from "./RecipientPayments/StatusSpan";

const SingleRecipientMainComponent = ({ recipient, refundCommission }) => {
  const { authToken } = useContext(IndiceContext);

  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const router = useRouter();
  const [doneAcceptModalOpen, setDoneAcceptModalOpen] = useState(false);

  const handleDoneAcceptClick = async ({ type, paypalId, cardNumber }) => {
    await waitingRefundMarkAsDone(
      { id: recipient.id, type, paypalId, cardNumber },
      authToken
    );
    router.push("/admin/payments/recipients/");
  };

  const totalPayed = workerPaymentCalculate(
    recipient.offerPrice,
    recipient.workerFee,
  );

  let paymentNumber = "-";
  let paymentNumberLabel = "Payment Number";

  if (isPayedUsedPaypal(recipient.type)) {
    if (recipient.data?.paypalId && recipient.data?.paypalId != "-") {
      paymentNumber = recipient.data.paypalId;
      paymentNumberLabel = "Payment Paypal Id";
    } else {
      paymentNumber = recipient.recipientPaypalId;
      paymentNumberLabel = "Recipient Paypal Id";
    }
  } else {
    if (recipient.data?.cardNumber) {
      paymentNumber = recipient.data?.cardNumber;
    }

    paymentNumberLabel = "Payment Number";
  }

  let operationMessageClasses =
    "bg-amber-100 dark:bg-amber-400/30 text-amber-600 dark:text-amber-400";
  let operationMessage = "Operation waiting admin approve";

  if (recipient.status == "failed") {
    operationMessageClasses =
      "bg-rose-100 dark:bg-rose-500/30 text-rose-500 dark:text-rose-400";
    operationMessage = "Operation mark as failed";
  }

  if (recipient.status == "completed") {
    operationMessageClasses =
      "bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400";
    operationMessage = "Operation mark as finished";
  }

  if (recipient.status == "cancelled") {
    operationMessageClasses =
      "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400";
    operationMessage = "Operation mark as cancelled";
  }

  if (recipient.receivedType === STATIC.RECIPIENT_PAYMENT_TYPES.RECIPIENT) {
    operationMessage = recipientStatuses({
      status: recipient.status,
      plannedTime: recipient.plannedTime,
      admin: true,
      failedDescription: recipient.failedDescription,
      orderStatus: recipient.orderStatus,
    });
  }

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
                      title: "Recipient Payments",
                      href: "/admin/payments/recipients",
                    },
                    { title: "#" + recipient.id },
                  ]}
                />
              </div>

              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
                <div className="flex flex-col md:flex-row md:-mr-px">
                  <div className="grow w-full">
                    <div className="p-6 space-y-6">
                      <h2 className="flex text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5 justify-between">
                        <div className="order-form-title max-w-full overflow-separate">
                          Payment Details
                        </div>
                      </h2>

                      <div
                        className={`min-w-fit form-input w-full mt-2 mb-1 font-semibold ${operationMessageClasses}`}
                      >
                        {operationMessage}
                      </div>

                      <section>
                        <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                          Order Information
                        </h2>

                        <div className="flex flex-col gap-2">
                          <div className="flex w-full gap-2">
                            <div className="w-full">
                              <InputView
                                value={recipient.listingName}
                                label="Listing Name"
                                name="listing-name"
                                placeholder="Listing Name"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>
                          </div>

                          <div className="flex w-full gap-2">
                            <div className="w-full sm:w-1/2">
                              <InputView
                                value={recipient.ownerName}
                                label="Listing Owner Name"
                                name="owner-name"
                                placeholder="Owner Name"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-full sm:w-1/2">
                              <InputView
                                value={recipient.workerName}
                                label="Worker Name"
                                name="worker-name"
                                placeholder="Worker Name"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>
                          </div>

                          <div className="flex w-full gap-2">
                            <div className="w-full sm:w-1/2">
                              <InputView
                                value={recipient.offerStartDate}
                                label="Offer Start Date"
                                name="offer-start-date"
                                placeholder="Offer Start Date"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-full sm:w-1/2">
                              <InputView
                                value={recipient.offerEndDate}
                                label="Offer End Date"
                                name="offer-end-date"
                                placeholder="Offer End Date"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>
                          </div>

                          <div className="flex w-full gap-2">
                            <div className="w-full sm:w-1/2">
                              <InputView
                                value={moneyFormat(recipient.offerPrice)}
                                label={`Offer Price (${STATIC.CURRENCY})`}
                                name="offer-price"
                                placeholder="Offer Price"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-full sm:w-1/2">
                              <InputView
                                value={moneyFormat(totalPayed)}
                                label={`Worker paid (${STATIC.CURRENCY})`}
                                name="worker-payed-money"
                                placeholder="Worker Paid"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </section>

                      {recipient.receivedType === "refund" && (
                        <section>
                          <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                            Refund Information
                          </h2>

                          <div className="flex flex-col gap-2">
                            <div className="flex w-full gap-2">
                              <div className="w-full sm:w-1/2">
                                <InputView
                                  value={recipient.recipientName}
                                  label="Recipient Name"
                                  name="recipient-name"
                                  placeholder="Recipient Name"
                                  labelClassName="block text-sm font-medium mb-1"
                                  inputClassName="form-input w-full"
                                />
                              </div>

                              <div className="w-full sm:w-1/2">
                                <InputView
                                  value={recipient.recipientEmail}
                                  label="Recipient Email"
                                  name="recipient-email"
                                  placeholder="Recipient Email"
                                  labelClassName="block text-sm font-medium mb-1"
                                  inputClassName="form-input w-full"
                                />
                              </div>
                            </div>
                            <div className="flex w-full gap-2">
                              <div className="w-full sm:w-1/2">
                                <InputView
                                  value={refundCommission}
                                  label="Refund Commission (%)"
                                  name="refund-commission"
                                  placeholder="Refund Commission"
                                  labelClassName="block text-sm font-medium mb-1"
                                  inputClassName="form-input w-full"
                                />
                              </div>

                              <div className="w-full sm:w-1/2">
                                <InputView
                                  value={moneyFormat(
                                    (totalPayed * (100 - refundCommission)) /
                                      100
                                  )}
                                  label={`Refund Without Commission (${STATIC.CURRENCY})`}
                                  name="refund-without-commission"
                                  placeholder="Refund Without Commission"
                                  labelClassName="block text-sm font-medium mb-1"
                                  inputClassName="form-input w-full"
                                />
                              </div>
                            </div>

                            <div className="flex w-full gap-2">
                              <div className="w-full sm:w-1/2">
                                <InputView
                                  value={
                                    recipient.type ==
                                    STATIC.PAYMENT_TYPES.BANK_TRANSFER
                                      ? "Credit Card"
                                      : "Paypal Id"
                                  }
                                  label="Recipient Type"
                                  name="recipient-type"
                                  placeholder="Recipient Type"
                                  labelClassName="block text-sm font-medium mb-1"
                                  inputClassName="form-input w-full"
                                />
                              </div>

                              <div className="w-full sm:w-1/2">
                                <InputView
                                  value={
                                    recipient.type ==
                                    STATIC.PAYMENT_TYPES.BANK_TRANSFER
                                      ? recipient.data.cardNumber
                                      : recipient.data.paypalId
                                  }
                                  label={
                                    recipient.type ==
                                    STATIC.PAYMENT_TYPES.BANK_TRANSFER
                                      ? "Card Number"
                                      : "Paypal Id"
                                  }
                                  name="refund-number"
                                  placeholder={
                                    recipient.type ==
                                    STATIC.PAYMENT_TYPES.BANK_TRANSFER
                                      ? "Card Number"
                                      : "Paypal Id"
                                  }
                                  labelClassName="block text-sm font-medium mb-1"
                                  inputClassName="form-input w-full"
                                />
                              </div>
                            </div>
                          </div>
                        </section>
                      )}

                      {recipient.receivedType === STATIC.RECIPIENT_PAYMENT_TYPES.RECIPIENT && (
                        <section>
                          <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                            Payment Information
                          </h2>

                          <div className="flex flex-col gap-2">
                            <div className="flex w-full gap-2">
                              <div className="w-full sm:w-1/2">
                                <InputView
                                  value={recipient.ownerName}
                                  label="Recipient Name"
                                  name="recipient-name"
                                  placeholder="Recipient Name"
                                  labelClassName="block text-sm font-medium mb-1"
                                  inputClassName="form-input w-full"
                                />
                              </div>

                              <div className="w-full sm:w-1/2">
                                <InputView
                                  value={recipient.ownerFee}
                                  label="Recipient Fee (%)"
                                  name="recipient-fee"
                                  placeholder="Recipient Fee"
                                  labelClassName="block text-sm font-medium mb-1"
                                  inputClassName="form-input w-full"
                                />
                              </div>
                            </div>

                            <div className="flex w-full gap-2">
                              <div className="w-full sm:w-1/2">
                                <InputView
                                  value={getPaymentNameByType(recipient.type)}
                                  label="Transfer Type"
                                  name="transfer-type"
                                  placeholder="Transfer Type"
                                  labelClassName="block text-sm font-medium mb-1"
                                  inputClassName="form-input w-full"
                                />
                              </div>

                              <div className="w-full sm:w-1/2">
                                <InputView
                                  value={paymentNumber}
                                  label={paymentNumberLabel}
                                  name="payment-money"
                                  placeholder={paymentNumberLabel}
                                  labelClassName="block text-sm font-medium mb-1"
                                  inputClassName="form-input w-full"
                                />
                              </div>
                            </div>

                            <div className="flex w-full gap-2">
                              <div className="w-full sm:w-1/2">
                                <InputView
                                  value={recipient.money}
                                  label="Planned to Pay"
                                  name="payment-money"
                                  placeholder="Planned to Pay"
                                  labelClassName="block text-sm font-medium mb-1"
                                  inputClassName="form-input w-full"
                                />
                              </div>

                              <div className="w-full sm:w-1/2">
                                <InputView
                                  value={dateConverter(recipient.plannedTime)}
                                  label="Scheduled Payment Date"
                                  name="payment-payed-at"
                                  placeholder="Scheduled Payment Date"
                                  labelClassName="block text-sm font-medium mb-1"
                                  inputClassName="form-input w-full"
                                />
                              </div>
                            </div>
                          </div>
                        </section>
                      )}
                    </div>

                    {recipient.status != "completed" && (
                      <footer>
                        <div className="flex flex-col px-6 py-5 border-t border-slate-200 dark:border-slate-700">
                          <div className="flex self-end">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDoneAcceptModalOpen(true);
                              }}
                              className="btn bg-teal-500 hover:bg-teal-600 text-white ml-3"
                            >
                              Mark as Done
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

          <AcceptModal
            active={!!doneAcceptModalOpen}
            close={() => setDoneAcceptModalOpen(false)}
            onAcceptClick={handleDoneAcceptClick}
            defaultPaypalId={recipient.recipientPaypalId}
          />
        </main>
      </div>
    </div>
  );
};

export default SingleRecipientMainComponent;
