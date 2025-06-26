import CreateUpdateOrderRequestModal from "./CreateUpdateOrderRequestModal";
import AcceptAcceptOrderModal from "./AcceptAcceptOrderModal";
import AcceptRejectOrderModal from "./AcceptRejectOrderModal";

const BookingActionModals = ({
  canApprove = false,
  order,
  listingPrice,
  proposalPrice,
  proposalStartTime,
  proposalFinishTime,
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
        handleCreateUpdateRequest={({ price, startTime, finishTime }) =>
          handleCreateUpdateRequest({ order, price, startTime, finishTime })
        }
        price={listingPrice}
        proposalPrice={proposalPrice}
        proposalFinishTime={proposalFinishTime}
        proposalStartTime={proposalStartTime}
        fee={fee}
        commissionType={commissionType}
        updateRequestModalActive={updateRequestModalActive}
        closeActiveUpdateRequest={() => setUpdateRequestModalActive(false)}
        listingName={listingName}
        blockedDates={blockedDates}
      />

      {canApprove && (
        <AcceptAcceptOrderModal
          acceptOrderModalActive={acceptOrderModalActive}
          closeAcceptOrderModal={() => setAcceptOrderModalActive(false)}
          handleAcceptAcceptOrder={() => handleAcceptAcceptOrder(order)}
        />
      )}

      <AcceptRejectOrderModal
        rejectOrderModalActive={rejectOrderModalActive}
        closeRejectOrderModal={() => setRejectOrderModalActive(false)}
        handleAcceptRejectOrder={() => handleAcceptRejectOrder(order)}
      />
    </>
  );
};

export default BookingActionModals;
