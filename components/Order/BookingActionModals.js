import CreateUpdateOrderRequestModal from "./CreateUpdateOrderRequestModal";
import AcceptAcceptOrderModal from "./AcceptAcceptOrderModal";
import AcceptRejectOrderModal from "./AcceptRejectOrderModal";

const BookingActionModals = ({
  orderId,
  listingPricePerDay,
  proposalPrice,
  proposalStartDate,
  proposalEndDate,
  listingMinRentalDays,
  fee,
  commissionType,
  listingName,
  blockedDates,

  updateRequestModalActive,
  setUpdateRequestModalActive,
  handleCreateUpdateRequest,

  acceptOrderModalActive,
  setAcceptOrderModalActive,
  handleAcceptAcceptOrder,

  rejectOrderModalActive,
  setRejectOrderModalActive,
  handleAcceptRejectOrder,
}) => {
  return (
    <>
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
        closeActiveUpdateRequest={() => setUpdateRequestModalActive(false)}
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

export default BookingActionModals;
