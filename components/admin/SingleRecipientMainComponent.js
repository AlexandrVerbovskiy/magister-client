import { useRouter } from "next/router";
import { failedRecipientMarkAsDone } from "../../services";
import { useAdminPage } from "../../hooks";
import { useContext, useState } from "react";
import { IndiceContext } from "../../contexts";
import {
  moneyFormat,
  tenantPaymentCalculate,
  timeConverter,
} from "../../utils";
import Sidebar from "../../partials/admin/Sidebar";
import Header from "../../partials/admin/Header";
import BreadCrumbs from "../../partials/admin/base/BreadCrumbs";
import InputView from "./Form/InputView";
import Input from "./Form/Input";
import YesNoModal from "./YesNoModal";
import AcceptModal from "./RecipientPayments/AcceptModal";

const SingleRecipientMainComponent = ({ recipient, refundCommission }) => {
  const { authToken } = useContext(IndiceContext);

  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();
  const [paymentNumber, setPaymentNumber] = useState(
    recipient.type == "paypal"
      ? recipient.data?.paypalId ?? "-"
      : recipient.data?.cardNumber ?? "-"
  );
  const [paymentNumberError, setPaymentNumberError] = useState(null);
  const [doneAcceptModalOpen, setDoneAcceptModalOpen] = useState(false);

  const handleDoneAcceptClick = async () => {
    await failedRecipientMarkAsDone(
      { id: recipient.id, paymentNumber },
      authToken
    );

    router.push("/admin/payments/recipients");
  };

  const totalPayed = tenantPaymentCalculate(
    recipient.offerStartDate,
    recipient.offerEndDate,
    recipient.tenantFee,
    recipient.offerPricePerDay
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
                      <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5">
                        Payment Details
                      </h2>

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
                                value={recipient.tenantName}
                                label="Renter Name"
                                name="renter-name"
                                placeholder="Renter Name"
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
                                value={moneyFormat(recipient.offerPricePerDay)}
                                label="Offer Price Per Day, $"
                                name="offer-price-per-day"
                                placeholder="Offer Price Per Date"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>

                            <div className="w-full sm:w-1/2">
                              <InputView
                                value={moneyFormat(totalPayed)}
                                label="Renter paid, $"
                                name="renter-payed-money"
                                placeholder="Renter Paid"
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
                                  label="Refund Commission, %"
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
                                  label="Refund Without Commission, $"
                                  name="refund-without-commission"
                                  placeholder="Refund Without Commission"
                                  labelClassName="block text-sm font-medium mb-1"
                                  inputClassName="form-input w-full"
                                />
                              </div>
                            </div>
                          </div>

                          {recipient.failedDescription && (
                            <div className="flex flex-col gap-2">
                              <div className="flex w-full gap-2">
                                <div className="w-full">
                                  <div className="text-wrap inline-flex font-medium rounded p-2.5 bg-rose-100 dark:bg-rose-500/30 text-rose-500 dark:text-rose-400 w-full mt-4">
                                    Rejected description:{" "}
                                    {recipient.failedDescription}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </section>
                      )}

                      {recipient.receivedType === "rental" && (
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
                                  label="Recipient Fee, %"
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
                                  value={
                                    recipient.type == "paypal"
                                      ? "Paypal"
                                      : "Transfer to Card"
                                  }
                                  label="Transfer Type"
                                  name="transfer-type"
                                  placeholder="Transfer Type"
                                  labelClassName="block text-sm font-medium mb-1"
                                  inputClassName="form-input w-full"
                                />
                              </div>

                              <div className="w-full sm:w-1/2">
                                {recipient.status == "failed" &&
                                recipient.receivedType == "rental" &&
                                recipient.type == "paypal" ? (
                                  <Input
                                    value={paymentNumber}
                                    label="Payment Number(editable)"
                                    name="payment-number"
                                    placeholder="Payment Number"
                                    labelClassName="block text-sm font-medium mb-1"
                                    inputClassName="form-input w-full"
                                    error={paymentNumberError}
                                    setValue={setPaymentNumber}
                                    setError={setPaymentNumberError}
                                  />
                                ) : (
                                  <InputView
                                    value={paymentNumber}
                                    label="Payment Number"
                                    name="payment-money"
                                    placeholder="Payment Number"
                                    labelClassName="block text-sm font-medium mb-1"
                                    inputClassName="form-input w-full"
                                  />
                                )}
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
                                  value={timeConverter(recipient.plannedTime)}
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
                                className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3"
                                disabled={disabled}
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
            active={doneAcceptModalOpen}
            close={() => setDoneAcceptModalOpen(false)}
            onAcceptClick={handleDoneAcceptClick}
          />
        </main>
      </div>
    </div>
  );
};

export default SingleRecipientMainComponent;
