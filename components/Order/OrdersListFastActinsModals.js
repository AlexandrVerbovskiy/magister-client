import { useContext, useEffect, useState } from "react";
import AcceptAcceptOrderModal from "./AcceptAcceptOrderModal";
import AcceptRejectOrderModal from "./AcceptRejectOrderModal";
import CancelModal from "./CancelModal";
import CreateUpdateOrderRequestModal from "./CreateUpdateOrderRequestModal";
import { IndiceContext } from "../../contexts";
import PayModal from "../PayModal";
import {
  workerPaymentCalculate,
} from "../../utils";
import SuccessIconPopup from "../../components/IconPopups/SuccessIconPopup";
import PayedCancelModal from "./PayedCancelModal";

const OrdersListFastActinsModals = ({
  activeCancel,
  closeActiveCancel,
  handleAcceptCancel,

  handleAcceptPayedFastCancel,
  activeFastCancel,
  closeActiveFastCancel,
  activeFastCancelOrder,

  handleAcceptUpdateRequest,
  activeUpdateRequest,
  closeActiveUpdateRequest,
  updateRequestModalActiveOrder,

  handleAcceptReject,
  rejectOrderModalActive,
  closeRejectOrderModal,

  handleAcceptAccept,
  acceptOrderModalActive,
  closeAcceptOrderModal,

  activePay,
  closePay,
  onWorkerPayed,
  activePayOrder,
  workerCancelFee,

  workerBaseCommission,
  successIconPopupState,

  bankInfo,
}) => {
  const { sessionUser, authToken } = useContext(IndiceContext);
  const [updateRequestPrice, setUpdateRequestPrice] = useState(0);
  const [updateRequestProposalPrice, setUpdateRequestProposalPrice] =
    useState(0);
  const [updateRequestProposalStartDate, setUpdateRequestProposalStartDate] =
    useState(Date.now());
  const [updateRequestProposalEndDate, setUpdateRequestProposalEndDate] =
    useState(Date.now());
  const [updateRequestFee, setUpdateRequestFee] = useState(0);
  const [updateRequestCommissionType, setUpdateRequestCommissionType] =
    useState("sum");
  const [updateRequestListingName, setUpdateRequestListingName] = useState("");

  const [payAmount, setPayAmount] = useState(0);
  const [payOrderId, setPayOrderId] = useState(null);
  const [payListingName, setPayListingName] = useState("");
  const [payPricePerDay, setPayPricePerDay] = useState(0);
  const [payOfferStartDate, setPayOfferStartDate] = useState(Date.now());
  const [payOfferEndDate, setPayOfferEndDate] = useState(Date.now());
  const [payOfferFee, setPayOfferFee] = useState(0);
  const [payedFastCancelDisabled, setPayedFastCancelDisabled] = useState(false);

  useEffect(() => {
    if (updateRequestModalActiveOrder) {
      setUpdateRequestPrice(
        updateRequestModalActiveOrder.listingPricePerDay ?? 0
      );
      setUpdateRequestProposalPrice(
        updateRequestModalActiveOrder.newPricePerDay ??
          updateRequestModalActiveOrder.offerPricePerDay ??
          0
      );
      setUpdateRequestProposalStartDate(
        updateRequestModalActiveOrder.newStartDate ??
          updateRequestModalActiveOrder.offerStartDate ??
          Date.now()
      );
      setUpdateRequestProposalEndDate(
        updateRequestModalActiveOrder.newEndDate ??
          updateRequestModalActiveOrder.offerEndDate ??
          Date.now()
      );
      setUpdateRequestFee(
        sessionUser?.id === updateRequestModalActiveOrder.ownerId
          ? updateRequestModalActiveOrder.ownerFee
          : updateRequestModalActiveOrder.workerFee
      );
      setUpdateRequestCommissionType(
        sessionUser?.id === updateRequestModalActiveOrder.ownerId
          ? "reject"
          : "sum"
      );
      setUpdateRequestListingName(updateRequestModalActiveOrder.listingName);
    }
  }, [updateRequestModalActiveOrder, sessionUser]);

  useEffect(() => {
    const newAmount = activePayOrder
      ? workerPaymentCalculate(
          activePayOrder.offerStartDate,
          activePayOrder.offerEndDate,
          activePayOrder.workerFee,
          activePayOrder.offerPricePerDay
        )
      : 0;
    setPayAmount(newAmount);
    setPayOrderId(activePayOrder?.id ?? null);
    setPayListingName(activePayOrder?.listingName ?? "");
    setPayOfferFee(activePayOrder?.workerFee ?? 0);
    setPayPricePerDay(activePayOrder?.offerPricePerDay ?? 0);
    setPayOfferStartDate(activePayOrder?.offerStartDate ?? Date.now());
    setPayOfferEndDate(activePayOrder?.offerEndDate ?? Date.now());
  }, [activePayOrder, sessionUser]);

  return (
    <>
      <CancelModal
        modalActive={activeCancel}
        closeModal={closeActiveCancel}
        handleCancel={handleAcceptCancel}
      />
      <PayedCancelModal
        modalActive={activeFastCancel}
        handleClose={closeActiveFastCancel}
        handleCancel={handleAcceptPayedFastCancel}
        disabled={payedFastCancelDisabled}
        setDisabled={setPayedFastCancelDisabled}
      />

      <AcceptAcceptOrderModal
        acceptOrderModalActive={acceptOrderModalActive}
        closeAcceptOrderModal={closeAcceptOrderModal}
        handleAcceptAcceptOrder={handleAcceptAccept}
      />

      <AcceptRejectOrderModal
        rejectOrderModalActive={rejectOrderModalActive}
        closeRejectOrderModal={closeRejectOrderModal}
        handleAcceptRejectOrder={handleAcceptReject}
      />

      <CreateUpdateOrderRequestModal
        handleCreateUpdateRequest={handleAcceptUpdateRequest}
        price={updateRequestPrice}
        proposalPrice={updateRequestProposalPrice}
        proposalStartDate={updateRequestProposalStartDate}
        proposalEndDate={updateRequestProposalEndDate}
        fee={updateRequestFee}
        commissionType={updateRequestCommissionType}
        updateRequestModalActive={activeUpdateRequest}
        closeActiveUpdateRequest={closeActiveUpdateRequest}
        listingName={updateRequestListingName}
        workerFee={updateRequestModalActiveOrder?.workerFee ?? 0}
      />

      <PayModal
        amount={payAmount}
        orderId={payOrderId}
        listingName={payListingName}
        onWorkerPayed={onWorkerPayed}
        pricePerDay={payPricePerDay}
        offerStartDate={payOfferStartDate}
        offerEndDate={payOfferEndDate}
        offerFee={payOfferFee}
        modalActive={activePay}
        closeModal={closePay}
        authToken={authToken}
        bankInfo={bankInfo}
      />

      <SuccessIconPopup
        modalActive={successIconPopupState.active}
        closeModal={successIconPopupState.onClose}
        textWeight={successIconPopupState.textWeight}
        text={successIconPopupState.text}
        mainCloseButtonText={successIconPopupState.closeButtonText}
      />
    </>
  );
};

export default OrdersListFastActinsModals;
