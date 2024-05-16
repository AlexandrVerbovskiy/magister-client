import { useContext, useEffect, useState } from "react";
import AcceptAcceptOrderModal from "./AcceptAcceptOrderModal";
import AcceptRejectOrderModal from "./AcceptRejectOrderModal";
import CancelModal from "./CancelModal";
import CreateDisputeModal from "./CreateDisputeModal";
import CreateUpdateOrderRequestModal from "./CreateUpdateOrderRequestModal";
import { IndiceContext } from "../../contexts";
import PaypalModal from "../PaypalModal";
import { tenantPaymentCalculate } from "../../utils";

const OrdersListFastActinsModals = ({
  activeCancel,
  closeActiveCancel,
  handleAcceptCancel,

  handleAcceptPayedFastCancel,
  activeFastCancel,
  closeActiveFastCancel,

  handleAcceptCreateDispute,
  activeCreateDispute,
  closeActiveCreateDispute,

  handleOrderAcceptAcceptCancelByTenant,
  activeOrderAcceptCancelByTenant,
  closeActiveOrderAcceptCancelByTenant,

  handleOrderAcceptAcceptCancelByOwner,
  activeOrderAcceptCancelByOwner,
  closeActiveOrderAcceptCancelByOwner,

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
  handleClosePay,
  onTenantPayed,
  activePayOrder,
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
        updateRequestModalActiveOrder.blockedDates ?? []
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

  return (
    <>
      <CancelModal
        modalActive={activeCancel}
        closeModal={closeActiveCancel}
        onCancel={handleAcceptCancel}
      />
      <CancelModal
        modalActive={activeFastCancel}
        closeModal={closeActiveFastCancel}
        onCancel={handleAcceptPayedFastCancel}
      />

      <CreateDisputeModal
        modalActive={activeCreateDispute}
        closeModal={closeActiveCreateDispute}
        onCreateDispute={handleAcceptCreateDispute}
      />

      <CancelModal
        modalActive={activeOrderAcceptCancelByTenant}
        closeModal={closeActiveOrderAcceptCancelByTenant}
        onCancel={handleOrderAcceptAcceptCancelByTenant}
      />
      <CancelModal
        modalActive={activeOrderAcceptCancelByOwner}
        closeModal={closeActiveOrderAcceptCancelByOwner}
        onCancel={handleOrderAcceptAcceptCancelByOwner}
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
      />

      <PaypalModal
        amount={payAmount}
        orderId={payOrderId}
        listingName={payListingName}
        onTenantPayed={onTenantPayed}
        pricePerDay={payPricePerDay}
        offerStartDate={payOfferStartDate}
        offerEndDate={payOfferEndDate}
        offerFee={payOfferFee}
        modalActive={activePay}
        closeModal={handleClosePay}
        authToken={authToken}
      />
    </>
  );
};

export default OrdersListFastActinsModals;