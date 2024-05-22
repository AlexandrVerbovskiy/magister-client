import { useAdminPage } from "../../../../hooks";
import { adminSideProps } from "../../../../middlewares";
import Header from "../../../../partials/admin/Header";
import Sidebar from "../../../../partials/admin/Sidebar";
import BreadCrumbs from "../../../../partials/admin/base/BreadCrumbs";
import {
  getAdminWaitingRefundOptions,
  waitingRefundMarkAsDone,
  waitingRefundMarkAsRejected,
} from "../../../../services";
import InputView from "../../../../components/admin/Form/InputView";
import { moneyFormat, tenantPaymentCalculate } from "../../../../utils";
import ErrorSpan from "../../../../components/admin/ErrorSpan";
import ModalWithDescription from "../../../../components/admin/Form/ModalWithDescription";
import { useRouter } from "next/router";
import { IndiceContext } from "../../../../contexts";
import { useContext, useState } from "react";
import YesNoModal from "../../../../components/admin/YesNoModal";

const WaitingRefund = ({ recipient, refundCommission }) => {
  const { error, success, authToken } = useContext(IndiceContext);

  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();

  const [accessDeclineModalOpen, setAccessDeclineModalOpen] = useState(false);
  const [accessAcceptModalOpen, setAccessAcceptModalOpen] = useState(false);

  const [declineDescription, setDeclineDescription] = useState("");
  const [declineDescriptionError, setDeclineDescriptionError] = useState(null);

  const handleInputDeclineDescription = (e) => {
    setDeclineDescription(e.target.value);
    setDeclineDescriptionError(null);
  };

  const handleDeclineClick = (e) => {
    e.stopPropagation();
    setAccessDeclineModalOpen(true);
  };

  const handleAcceptDeclineClick = async () => {
    setDeclineDescriptionError(null);

    if (declineDescription.length < 1) {
      setDeclineDescriptionError(
        "You must enter the reason for the rejection of the refunding"
      );
      return;
    }

    try {
      await waitingRefundMarkAsRejected(
        { id: recipient.id, description: declineDescription },
        authToken
      );
      setDisabled(true);

      router.push("/admin/payments/waiting-refunds");
      success.set("Marking as rejected finished successfully");
    } catch (e) {
      error.set(e.message);
      setDisabled(false);
    }
  };

  const handleAcceptAcceptClick = async () => {
    try {
      await waitingRefundMarkAsDone({ id: recipient.id }, authToken);
      setDisabled(true);

      router.push("/admin/payments/waiting-refunds");
      success.set("Marking as completed finished successfully");
    } catch (e) {
      error.set(e.message);
      setDisabled(false);
    }
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
                      title: "Waiting Refunds",
                      href: "/admin/payments/waiting-refunds",
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
                        Waiting Refund
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
                                label="Renter payed, $"
                                name="renter-payed-money"
                                placeholder="Renter Payed"
                                labelClassName="block text-sm font-medium mb-1"
                                inputClassName="form-input w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </section>

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
                                  (totalPayed * (100 - refundCommission)) / 100
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
                    </div>

                    <footer>
                      <div className="flex flex-col px-6 py-5 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex self-end">
                          <button
                            type="button"
                            onClick={handleDeclineClick}
                            className="btn bg-red-500 hover:bg-red-600 text-white"
                          >
                            Decline
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setAccessAcceptModalOpen(true);
                            }}
                            className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3"
                            disabled={disabled}
                          >
                            Mark as Done
                          </button>
                        </div>
                      </div>
                    </footer>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ModalWithDescription
            accessModalOpen={accessDeclineModalOpen}
            setAccessModalOpen={setAccessDeclineModalOpen}
            question="Are you sure you want decline this request?"
            descriptionLabel="Enter the reason for the refund"
            description={declineDescription}
            handleInputDescription={handleInputDeclineDescription}
            descriptionError={declineDescriptionError}
            handleAcceptClick={handleAcceptDeclineClick}
            acceptButtonText="Decline"
            disabled={disabled}
          />

          <YesNoModal
            title="Accept action"
            body="Are you sure you want to mark the payment as completed?"
            handleCloseModal={() => setAccessAcceptModalOpen(false)}
            onAccept={handleAcceptAcceptClick}
            modalOpen={accessAcceptModalOpen}
            setModalOpen={setAccessAcceptModalOpen}
            disabled={disabled}
          />
        </main>
      </div>
    </div>
  );
};

const boostServerSideProps = async ({ context, baseSideProps }) => {
  const id = context.params.id;
  const options = await getAdminWaitingRefundOptions(
    id,
    baseSideProps.authToken
  );

  return { ...options, id };
};

export const getServerSideProps = (context) =>
  adminSideProps(context, boostServerSideProps);

export default WaitingRefund;
