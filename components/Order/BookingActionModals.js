import CreateUpdateOrderRequestModal from "./CreateUpdateOrderRequestModal";
import AcceptAcceptOrderModal from "./AcceptAcceptOrderModal";
import AcceptRejectOrderModal from "./AcceptRejectOrderModal";

const BookingActionModals = ({
  canApprove = false,
  order,
  listingPrice,
  proposalPrice,
  proposalStartDate,
  proposalEndDate,
  fee,
  commissionType,
  listingName,

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
        handleCreateUpdateRequest={({ price, startDate, finishDate }) =>
          handleCreateUpdateRequest({ order, price, startDate, finishDate })
        }
        price={listingPrice}
        proposalPrice={proposalPrice}
        proposalFinishDate={proposalFinishDate}
        proposalStartDate={proposalStartDate}
        proposalEndDate={proposalEndDate}
        fee={fee}
        commissionType={commissionType}
        updateRequestModalActive={updateRequestModalActive}
        closeActiveUpdateRequest={() => setUpdateRequestModalActive(false)}
        listingName={listingName}
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
