import STATIC from "../../static";
import BookingModal from "../SingleListings/BookingModal";
import CancelModal from "./CancelModal";
import PayedCancelModal from "./PayedCancelModal";
import BookingActionModals from "./BookingActionModals";
import PayModal from "../PayModal";
import { calculateCurrentTotalPrice, increaseDateByOneDay } from "../../utils";
import { useContext } from "react";
import { IndiceContext } from "../../contexts";

const OrderPopups = ({
  order,
  actualUpdateRequest = null,
  tenantBaseCommission,
  currentFee,
  actionButtons,

  extendPopupActive,
  setExtendPopupActive,
  onMakeExtend,

  handleCancelApprove,
  cancelModalActive,
  setCancelModalActive,

  handlePayedFastCancel,
  payedCancelModalActive,
  setPayedCancelModalActive,
  payedCancelDisabled,
  setPayedCancelDisabled,

  updateRequestModalActive,
  setUpdateRequestModalActive,
  handleCreateUpdateRequest,
  acceptOrderModalActive,
  setAcceptOrderModalActive,
  handleAcceptRejectOrder,
  rejectOrderModalActive,
  setRejectOrderModalActive,
  handleAcceptAcceptOrder,

  paypalModalActive,
  setPaypalModalActive,
  bankInfo,

  onTenantPayed,
}) => {
  const { authToken, sessionUser } = useContext(IndiceContext);

  const isOwner = sessionUser.id == order.ownerId;

  const localCalculateCurrentTotalPrice = ({
    type = null,
    startDate,
    endDate,
    pricePerDay,
  }) =>
    calculateCurrentTotalPrice({
      startDate,
      endDate,
      pricePerDay,
      type,
      isOwner,
      ownerFee: order.ownerFee,
      tenantFee: order.tenantFee,
    });

  return (
    <>
      {actionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.BOOKING_AGREEMENT_SECTION
      ) && (
        <BookingActionModals
          orderId={order.id}
          listingPricePerDay={order.listingPricePerDay}
          proposalPrice={
            actualUpdateRequest
              ? actualUpdateRequest.newPricePerDay
              : order.offerPricePerDay
          }
          proposalStartDate={
            actualUpdateRequest
              ? actualUpdateRequest.newStartDate
              : order.offerStartDate
          }
          proposalEndDate={
            actualUpdateRequest
              ? actualUpdateRequest.newEndDate
              : order.offerEndDate
          }
          listingMinRentalDays={order.listingMinRentalDays}
          fee={currentFee}
          commissionType={
            order.status == STATIC.ORDER_STATUSES.PENDING_OWNER
              ? "reject"
              : "sum"
          }
          listingName={order.listingName}
          blockedDates={order.blockedDates}
          updateRequestModalActive={updateRequestModalActive}
          setUpdateRequestModalActive={setUpdateRequestModalActive}
          handleCreateUpdateRequest={handleCreateUpdateRequest}
          acceptOrderModalActive={acceptOrderModalActive}
          setAcceptOrderModalActive={setAcceptOrderModalActive}
          handleAcceptAcceptOrder={handleAcceptAcceptOrder}
          rejectOrderModalActive={rejectOrderModalActive}
          setRejectOrderModalActive={setRejectOrderModalActive}
          handleAcceptRejectOrder={handleAcceptRejectOrder}
        />
      )}

      {actionButtons.includes(STATIC.ORDER_ACTION_BUTTONS.EXTEND_BUTTON) && (
        <BookingModal
          createOrderModalActive={extendPopupActive}
          closeModal={() => setExtendPopupActive(false)}
          handleMakeBooking={onMakeExtend}
          fee={tenantBaseCommission}
          price={order.offerPricePerDay}
          minRentalDays={order.listingMinRentalDays}
          listingName={order.listingName}
          blockedDates={order.blockedForRentalDates}
          title="Extend Now"
          startDate={
            order.offerEndDate ? increaseDateByOneDay(order.offerEndDate) : null
          }
        />
      )}

      {actionButtons.includes(STATIC.ORDER_ACTION_BUTTONS.CANCEL_BUTTON) && (
        <CancelModal
          handleCancel={handleCancelApprove}
          modalActive={cancelModalActive}
          closeModal={() => setCancelModalActive(false)}
        />
      )}

      {actionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.FAST_CANCEL_BUTTON
      ) && (
        <PayedCancelModal
          handleCancel={handlePayedFastCancel}
          modalActive={payedCancelModalActive}
          disabled={payedCancelDisabled}
          setDisabled={setPayedCancelDisabled}
          handleClose={() => setPayedCancelModalActive(false)}
        />
      )}

      <PayModal
        modalActive={paypalModalActive}
        closeModal={() => setPaypalModalActive(false)}
        amount={localCalculateCurrentTotalPrice({
          startDate: order.offerStartDate,
          endDate: order.offerEndDate,
          pricePerDay: order.offerPricePerDay,
          type: "tenant",
        })}
        orderId={order.id}
        listingName={order.listingName}
        onTenantPayed={onTenantPayed}
        pricePerDay={order.offerPricePerDay}
        offerStartDate={order.offerStartDate}
        offerEndDate={order.offerEndDate}
        offerFee={order.tenantFee}
        authToken={authToken}
        bankInfo={bankInfo}
      />
    </>
  );
};

export default OrderPopups;
