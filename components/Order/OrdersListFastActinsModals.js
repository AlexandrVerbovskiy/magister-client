import { useContext, useEffect, useState } from "react";
import AcceptAcceptOrderModal from "./AcceptAcceptOrderModal";
import AcceptRejectOrderModal from "./AcceptRejectOrderModal";
import CancelModal from "./CancelModal";
import CreateUpdateOrderRequestModal from "./CreateUpdateOrderRequestModal";
import { IndiceContext } from "../../contexts";
import PayModal from "../PayModal";
import {
  getOrderBlockedDatesToExtend,
  getOrderBlockedDatesToUpdate,
  getStartExtendOrderDate,
  tenantPaymentCalculate,
} from "../../utils";
import SuccessIconPopup from "../../components/IconPopups/SuccessIconPopup";
import PayedCancelModal from "./PayedCancelModal";
import BookingModal from "../SingleListings/BookingModal";

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
  onTenantPayed,
  activePayOrder,
  tenantCancelFee,

  handleClickApproveExtendOrder,
  extendModalActive,
  extendModalActiveOrder,
  closeExtendOrder,

  tenantBaseCommission,
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
  const [updateRequestMinRentalDays, setUpdateRequestMinRentalDays] =
    useState(0);
  const [updateRequestFee, setUpdateRequestFee] = useState(0);
  const [updateRequestCommissionType, setUpdateRequestCommissionType] =
    useState("sum");
  const [updateRequestListingName, setUpdateRequestListingName] = useState("");
  const [updateRequestBlockedDates, setUpdateRequestBlockedDates] = useState(
    []
  );

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
      setUpdateRequestMinRentalDays(
        updateRequestModalActiveOrder.listingMinRentalDays ?? 0
      );
      setUpdateRequestFee(
        sessionUser?.id === updateRequestModalActiveOrder.ownerId
          ? updateRequestModalActiveOrder.ownerFee
          : updateRequestModalActiveOrder.tenantFee
      );
      setUpdateRequestCommissionType(
        sessionUser?.id === updateRequestModalActiveOrder.ownerId
          ? "reject"
          : "sum"
      );
      setUpdateRequestListingName(updateRequestModalActiveOrder.listingName);
      setUpdateRequestBlockedDates(
        getOrderBlockedDatesToUpdate(updateRequestModalActiveOrder)
      );
    }
  }, [updateRequestModalActiveOrder, sessionUser]);

  useEffect(() => {
    const newAmount = activePayOrder
      ? tenantPaymentCalculate(
          activePayOrder.offerStartDate,
          activePayOrder.offerEndDate,
          activePayOrder.tenantFee,
          activePayOrder.offerPricePerDay
        )
      : 0;
    setPayAmount(newAmount);
    setPayOrderId(activePayOrder?.id ?? null);
    setPayListingName(activePayOrder?.listingName ?? "");
    setPayOfferFee(activePayOrder?.tenantFee ?? 0);
    setPayPricePerDay(activePayOrder?.offerPricePerDay ?? 0);
    setPayOfferStartDate(activePayOrder?.offerStartDate ?? Date.now());
    setPayOfferEndDate(activePayOrder?.offerEndDate ?? Date.now());
  }, [activePayOrder, sessionUser]);

  let extendStartDate = null;

  if (extendModalActiveOrder) {
    extendStartDate = getStartExtendOrderDate(
      extendModalActiveOrder.offerEndDate,
      extendModalActiveOrder.extendOrders
    );
  }

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
        minRentalDays={updateRequestMinRentalDays}
        fee={updateRequestFee}
        commissionType={updateRequestCommissionType}
        updateRequestModalActive={activeUpdateRequest}
        closeActiveUpdateRequest={closeActiveUpdateRequest}
        listingName={updateRequestListingName}
        blockedDates={updateRequestBlockedDates}
        tenantFee={updateRequestModalActiveOrder?.tenantFee ?? 0}
      />

      <PayModal
        amount={payAmount}
        orderId={payOrderId}
        listingName={payListingName}
        onTenantPayed={onTenantPayed}
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

      <BookingModal
        handleMakeBooking={handleClickApproveExtendOrder}
        price={extendModalActiveOrder?.offerPricePerDay ?? 0}
        minRentalDays={extendModalActiveOrder?.listingMinRentalDays ?? 0}
        fee={tenantBaseCommission}
        createOrderModalActive={extendModalActive}
        closeModal={closeExtendOrder}
        listingName={extendModalActiveOrder?.listingName ?? ""}
        blockedDates={getOrderBlockedDatesToExtend(extendModalActiveOrder)}
        title="Extend Now"
        startDate={extendStartDate}
        isExtend={true}
        fullVersion={true}
      />
    </>
  );
};

export default OrdersListFastActinsModals;
