import { useContext, useEffect, useState } from "react";
import AcceptAcceptOrderModal from "./AcceptAcceptOrderModal";
import AcceptRejectOrderModal from "./AcceptRejectOrderModal";
import CancelModal from "./CancelModal";
import CreateUpdateOrderRequestModal from "./CreateUpdateOrderRequestModal";
import { IndiceContext } from "../../contexts";
import PayModal from "../PayModal";
import { workerPaymentCalculate } from "../../utils";
import SuccessIconPopup from "../../components/IconPopups/SuccessIconPopup";
import PayedCancelModal from "./PayedCancelModal";

const OrdersListFastActinsModals = ({
  activeCancel,
  closeActiveCancel,
  handleAcceptCancel,

  handleAcceptPayedFastCancel,
  activeFastCancel,
  closeActiveFastCancel,

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

  successIconPopupState,
  bankInfo,
}) => {
  const { sessionUser, authToken } = useContext(IndiceContext);
  const [updateRequestPrice, setUpdateRequestPrice] = useState(0);
  const [updateRequestProposalPrice, setUpdateRequestProposalPrice] =
    useState(0);
  const [updateRequestProposalFinishTime, setUpdateRequestProposalFinishTime] =
    useState(new Date());
  const [updateRequestFee, setUpdateRequestFee] = useState(0);
  const [updateRequestCommissionType, setUpdateRequestCommissionType] =
    useState("sum");
  const [updateRequestListingName, setUpdateRequestListingName] = useState("");

  const [payAmount, setPayAmount] = useState(0);
  const [payOrderId, setPayOrderId] = useState(null);
  const [payListingName, setPayListingName] = useState("");
  const [payPrice, setPayPrice] = useState(0);
  const [payOfferFee, setPayOfferFee] = useState(0);
  const [payedFastCancelDisabled, setPayedFastCancelDisabled] = useState(false);

  useEffect(() => {
    if (updateRequestModalActiveOrder) {
      setUpdateRequestPrice(updateRequestModalActiveOrder.listingPrice ?? 0);
      setUpdateRequestProposalPrice(
        updateRequestModalActiveOrder.newPrice ??
          updateRequestModalActiveOrder.offerPrice ??
          0
      );
      setUpdateRequestProposalFinishTime(
        updateRequestModalActiveOrder.newFinishTime ??
          updateRequestModalActiveOrder.offerFinishTime ??
          new Date()
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
          activePayOrder.offerPrice,
          activePayOrder.workerFee
        )
      : 0;
    setPayAmount(newAmount);
    setPayOrderId(activePayOrder?.id ?? null);
    setPayListingName(activePayOrder?.listingName ?? "");
    setPayOfferFee(activePayOrder?.workerFee ?? 0);
    setPayPrice(activePayOrder?.offerPrice ?? 0);
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
        proposalFinishTime={updateRequestProposalFinishTime}
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
        price={payPrice}
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
