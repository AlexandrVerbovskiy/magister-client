import {
  dateConverter,
  fullDateConverter,
  moneyFormatVisual,
} from "../../../utils";
import YesNoModal from "../../_App/YesNoModal";

const YesNoRentalModal = ({
  finishDate,
  startDate,
  price,
  listing,
  handleApprove,
  totalPrice,
  activeAcceptSendBookingRequest,
  setActiveAcceptSendBookingRequest,
}) => {
  let message = `Rent '${listing.name}' from ${dateConverter(
    startDate
  )} to ${dateConverter(finishDate)} and pay ${moneyFormatVisual(
    price
  )}, total amount of ${moneyFormatVisual(totalPrice)} (including fees).`;

  message +=
    "<br><b>PS: you will not be charged yet, this is just a request</b>";

  return (
    <YesNoModal
      active={activeAcceptSendBookingRequest}
      closeModal={() => setActiveAcceptSendBookingRequest(false)}
      title="Please confirm the request"
      onAccept={handleApprove}
      acceptText="Confirm"
      body={message}
      bodyType="html"
    />
  );
};

export default YesNoRentalModal;
