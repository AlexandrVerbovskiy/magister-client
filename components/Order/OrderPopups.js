import STATIC from "../../static";
import CancelModal from "./CancelModal";
import PayedCancelModal from "./PayedCancelModal";
import BookingActionModals from "./BookingActionModals";
import PayModal from "../PayModal";
import { autoCalculateCurrentTotalPrice } from "../../utils";
import { useContext } from "react";
import { IndiceContext } from "../../contexts";
import YesNoModal from "../_App/YesNoModal";

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

  onRenterPayed = null,

  finishModalActive,
  setFinishModalActive,
  handleAcceptFinishModalActive,
  acceptFinishModalActive,
  setAcceptFinishModalActive,
  handleAcceptAcceptFinishModalActive,
}) => {
  const { authToken } = useContext(IndiceContext);

  if (!order) {
    return;
  }

  return (
    <>
      {(actionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.BOOKING_AGREEMENT_SECTION
      ) ||
        actionButtons.includes(
          STATIC.ORDER_ACTION_BUTTONS.BOOKING_UPDATING_SECTION
        )) && (
        <BookingActionModals
          order={order}
          listingPrice={order.listingPrice}
          proposalPrice={
            actualUpdateRequest
              ? actualUpdateRequest.newPrice
              : order.offerPrice
          }
          proposalStartTime={
            actualUpdateRequest
              ? actualUpdateRequest.newStartTime
              : order.offerStartTime
          }
          proposalFinishTime={
            actualUpdateRequest
              ? actualUpdateRequest.newFinishTime
              : order.offerFinishTime
          }
          fee={currentFee}
          renterFee={order.renterFee}
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
          canApprove={actionButtons.includes(
            STATIC.ORDER_ACTION_BUTTONS.BOOKING_AGREEMENT_SECTION
          )}
        />
      )}

      {actionButtons.includes(STATIC.ORDER_ACTION_BUTTONS.CANCEL_BUTTON) && (
        <CancelModal
          handleCancel={handleCancelApprove}
          modalActive={cancelModalActive}
          closeModal={() => setCancelModalActive(false)}
        />
      )}

      {actionButtons.includes(STATIC.ORDER_ACTION_BUTTONS.FINISH_BUTTON) && (
        <YesNoModal
          active={finishModalActive}
          closeModal={() => setFinishModalActive(false)}
          title="Finish order"
          body="To send finish request, click 'Confirm'"
          onAccept={handleAcceptFinishModalActive}
          acceptText="Confirm"
          closeModalText="Close"
        />
      )}

      {actionButtons.includes(
        STATIC.ORDER_ACTION_BUTTONS.ACCEPT_OWNER_FINISH_BUTTON
      ) && (
        <YesNoModal
          active={acceptFinishModalActive}
          closeModal={() => setAcceptFinishModalActive(false)}
          title="Accept Finish"
          body="To accept finish request, click 'Confirm'"
          onAccept={handleAcceptAcceptFinishModalActive}
          acceptText="Confirm"
          closeModalText="Close"
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
        amount={autoCalculateCurrentTotalPrice({
          isOwner: false,
          price: order.offerPrice,
          ownerFee: order.ownerFee,
          renterFee: order.renterFee,
          type: "renter",
        })}
        orderId={order.id}
        listingName={order.listingName}
        onRenterPayed={onRenterPayed}
        price={order.offerPrice}
        offerFee={order.renterFee}
        authToken={authToken}
        bankInfo={bankInfo}
      />
    </>
  );
};

export default OrderPopups;
