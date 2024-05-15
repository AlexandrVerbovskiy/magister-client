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
import AcceptAcceptOrderModal from "./AcceptAcceptOrderModal";
import AcceptRejectOrderModal from "./AcceptRejectOrderModal";
import useBookingAgreementPanel from "../../hooks/useBookingAgreementPanel";

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
  const {
    disabled,
    updateRequestModalActive,
    setUpdateRequestModalActive,
    handleCreateUpdateRequest,
    acceptOrderModalActive,
    setAcceptOrderModalActive,
    handleAcceptRejectOrder,
    rejectOrderModalActive,
    setRejectOrderModalActive,
    handleAcceptAcceptOrder,
  } = useBookingAgreementPanel({
    setUpdatedOffer,
    setActualUpdateRequest,
    setPrevUpdateRequest,
    ownerId,
    onCreateUpdateRequest,
  });

  return (
    <>
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
        Edit
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
        handleCreateUpdateRequest={({ price, fromDate, toDate }) =>
          handleCreateUpdateRequest({ orderId, price, fromDate, toDate })
        }
        price={listingPricePerDay}
        proposalPrice={proposalPrice}
        proposalStartDate={proposalStartDate}
        proposalEndDate={proposalEndDate}
        minRentalDays={listingMinRentalDays}
        fee={fee}
        commissionType={commissionType}
        updateRequestModalActive={updateRequestModalActive}
        closeActiveUpdateRequest={()=>setUpdateRequestModalActive(false)}
        listingName={listingName}
        blockedDates={blockedDates}
      />

      <AcceptAcceptOrderModal
        acceptOrderModalActive={acceptOrderModalActive}
        closeAcceptOrderModal={() => setAcceptOrderModalActive(false)}
        handleAcceptAcceptOrder={() => handleAcceptAcceptOrder(orderId)}
      />

      <AcceptRejectOrderModal
        rejectOrderModalActive={rejectOrderModalActive}
        closeRejectOrderModal={() => setRejectOrderModalActive(false)}
        handleAcceptRejectOrder={() => handleAcceptRejectOrder(orderId)}
      />
    </>
  );
};

export default BookingAgreementPanel;
