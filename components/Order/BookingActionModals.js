import CreateUpdateOrderRequestModal from "./CreateUpdateOrderRequestModal";
import AcceptAcceptOrderModal from "./AcceptAcceptOrderModal";
import AcceptRejectOrderModal from "./AcceptRejectOrderModal";

const BookingActionModals = ({
  order,
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
          handleCreateUpdateRequest({ order, price, fromDate, toDate })
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
        handleAcceptAcceptOrder={() => handleAcceptAcceptOrder(order)}
      />

      <AcceptRejectOrderModal
        rejectOrderModalActive={rejectOrderModalActive}
        closeRejectOrderModal={() => setRejectOrderModalActive(false)}
        handleAcceptRejectOrder={() => handleAcceptRejectOrder(order)}
      />
    </>
  );
};

export default BookingActionModals;
