import STATIC from "../../static";
import BookingModal from "../SingleListings/BookingModal";
import CancelModal from "./CancelModal";
import PayedCancelModal from "./PayedCancelModal";
import BookingActionModals from "./BookingActionModals";
import PayModal from "../PayModal";
import {
  calculateCurrentTotalPrice,
  getOrderBlockedDatesToExtend,
  getOrderBlockedDatesToUpdate,
  getStartExtendOrderDate,
} from "../../utils";
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
  handleMakeBooking,

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

  onTenantPayed = null,
}) => {
  const { authToken } = useContext(IndiceContext);

  if (!order) {
    return;
  }

  const extendStartDate = getStartExtendOrderDate(
    order.offerEndDate,
    order.extendOrders
  );

  return (
    <>
      {actionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.BOOKING_AGREEMENT_SECTION
      ) && (
        <BookingActionModals
          order={order}
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
          tenantFee={order.tenantFee}
          commissionType={
            order.status == STATIC.ORDER_STATUSES.PENDING_OWNER
              ? "reject"
              : "sum"
          }
          listingName={order.listingName}
          blockedDates={getOrderBlockedDatesToUpdate(order)}
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
          handleMakeBooking={handleMakeBooking}
          fee={tenantBaseCommission}
          price={order.offerPricePerDay}
          minRentalDays={order.listingMinRentalDays}
          listingName={order.listingName}
          blockedDates={getOrderBlockedDatesToExtend(order)}
          title="Extend Now"
          startDate={extendStartDate}
          fullVersion={true}
          isExtend={true}
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
        amount={calculateCurrentTotalPrice({
          isOwner: false,
          startDate: order.offerStartDate,
          endDate: order.offerEndDate,
          pricePerDay: order.offerPricePerDay,
          ownerFee: order.ownerFee,
          tenantFee: order.tenantFee,
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
