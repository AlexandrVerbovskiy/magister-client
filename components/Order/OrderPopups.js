import STATIC from "../../static";
import BookingModal from "../SingleListings/BookingModal";
import CancelModal from "./CancelModal";
import PayedCancelModal from "./PayedCancelModal";
import BookingActionModals from "./BookingActionModals";
import PayModal from "../PayModal";
import {
  calculateCurrentTotalPrice,
} from "../../utils";
import { useContext } from "react";
import { IndiceContext } from "../../contexts";

const OrderPopups = ({
  order,
  actualUpdateRequest = null,
  currentFee,
  actionButtons,

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

  onWorkerPayed = null,
}) => {
  const { authToken } = useContext(IndiceContext);

  if (!order) {
    return;
  }

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
          fee={currentFee}
          workerFee={order.workerFee}
          commissionType={
            order.status == STATIC.ORDER_STATUSES.PENDING_OWNER
              ? "reject"
              : "sum"
          }
          listingName={order.listingName}
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
          workerFee: order.workerFee,
          type: "worker",
        })}
        orderId={order.id}
        listingName={order.listingName}
        onWorkerPayed={onWorkerPayed}
        pricePerDay={order.offerPricePerDay}
        offerStartDate={order.offerStartDate}
        offerEndDate={order.offerEndDate}
        offerFee={order.workerFee}
        authToken={authToken}
        bankInfo={bankInfo}
      />
    </>
  );
};

export default OrderPopups;
