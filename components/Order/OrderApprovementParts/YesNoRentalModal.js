import { fullDateConverter, moneyFormatVisual } from "../../../utils";
import YesNoModal from "../../_App/YesNoModal";

const YesNoRentalModal = ({
  finishTime,
  startTime,
  price,
  listing,
  handleApprove,
  totalPrice,
  activeAcceptSendBookingRequest,
  setActiveAcceptSendBookingRequest,
}) => {
  let message = `Rent '${listing.name}' from ${fullDateConverter(
    startTime
  )} to ${fullDateConverter(finishTime)} and pay ${moneyFormatVisual(
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
