import { useContext, useState } from "react";
import YesNoModal from "../_App/YesNoModal";
import CreateUpdateOrderRequestModal from "./CreateUpdateOrderRequestModal";
import { IndiceContext } from "../../contexts";
import {
  createOrderUpdateRequest,
  rejectOrder,
  acceptOrder,
} from "../../services";
import STATIC from "../../static";

const BookingAgreementPanel = ({
  acceptView,
  listingName,
  blockedDates,
  commissionType,
  listingPricePerDay,
  proposalPrice,
  proposalStartDate,
  proposalEndDate,
  listingMinRentalDays,
  fee,
  setUpdatedOffer,
  setActualUpdateRequest,
  setPrevUpdateRequest,
  orderId,
  ownerId,
  onCreateUpdateRequest,
}) => {
  const [disabled, setDisabled] = useState(false);
  const [updateRequestModalActive, setUpdateRequestModalActive] =
    useState(false);
  const [acceptOrderModalActive, setAcceptOrderModalActive] = useState(false);
  const [rejectOrderModalActive, setRejectOrderModalActive] = useState(false);

  const { sessionUser, authToken, error, success } = useContext(IndiceContext);
  const handleCreateUpdateRequest = async ({ price, fromDate, toDate }) => {
    if (disabled) {
      return;
    }

    try {
      setDisabled(true);
      setUpdateRequestModalActive(false);

      await createOrderUpdateRequest(
        {
          orderId: orderId,
          newStartDate: fromDate,
          newEndDate: toDate,
          newPricePerDay: price,
        },
        authToken
      );

      onCreateUpdateRequest({ price, fromDate, toDate });
    } catch (e) {
      error.set(e.message);
    } finally {
      setDisabled(false);
    }
  };

  const handleAcceptAcceptOrder = async () => {
    if (disabled) {
      return;
    }

    try {
      setDisabled(true);

      await acceptOrder(orderId, authToken);

      setActualUpdateRequest(null);
      setPrevUpdateRequest(null);
      setUpdatedOffer(STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT);
      success.set("Order accepted successfully");
    } catch (e) {
      error.set(e.message);
    } finally {
      setDisabled(false);
    }
  };

  const handleAcceptRejectOrder = async () => {
    if (disabled) {
      return;
    }

    try {
      setDisabled(true);

      await rejectOrder(orderId, authToken);

      setActualUpdateRequest(null);
      setPrevUpdateRequest(null);

      if (sessionUser?.id == ownerId) {
        setUpdatedOffer(STATIC.ORDER_STATUSES.REJECTED);
      } else {
        setUpdatedOffer(null, STATIC.ORDER_CANCELATION_STATUSES.CANCELLED);
      }

      success.set("Order cancelled successfully");
    } catch (e) {
      error.set(e.message);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <div className="order_widget add-listings-box">
      <h3>Booking operations</h3>
      <div className="booking-operations form-group">
        {acceptView && (
          <button
            className="default-btn"
            type="button"
            onClick={() => setAcceptOrderModalActive(true)}
            disabled={disabled}
          >
            Accept
          </button>
        )}

        <button
          className="default-btn"
          type="button"
          onClick={() => setUpdateRequestModalActive(true)}
          disabled={disabled}
        >
          Offer other terms
        </button>

        <button
          className="default-btn error-btn"
          type="button"
          onClick={() => setRejectOrderModalActive(true)}
          disabled={disabled}
        >
          Reject
        </button>

        <CreateUpdateOrderRequestModal
          handleCreateUpdateRequest={handleCreateUpdateRequest}
          price={listingPricePerDay}
          proposalPrice={proposalPrice}
          proposalStartDate={proposalStartDate}
          proposalEndDate={proposalEndDate}
          minRentalDays={listingMinRentalDays}
          fee={fee}
          commissionType={commissionType}
          updateRequestModalActive={updateRequestModalActive}
          setUpdateRequestModalActive={setUpdateRequestModalActive}
          listingName={listingName}
          blockedDates={blockedDates}
        />

        <YesNoModal
          active={acceptOrderModalActive}
          toggleActive={() => setAcceptOrderModalActive(false)}
          title="Operation confirmation"
          body="Confirm that the proposed booking conditions are actually suitable for you"
          onAccept={handleAcceptAcceptOrder}
          acceptText="Accept"
        />
        <YesNoModal
          active={rejectOrderModalActive}
          toggleActive={() => setRejectOrderModalActive(false)}
          title="Operation confirmation"
          body="Confirm that you really want to cancel the booking"
          onAccept={handleAcceptRejectOrder}
          acceptText="Accept"
        />
      </div>
    </div>
  );
};

export default BookingAgreementPanel;
