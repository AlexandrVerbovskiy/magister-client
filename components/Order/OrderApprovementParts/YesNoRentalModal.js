import { fullDateConverter, moneyFormatVisual } from "../../../utils";
import YesNoModal from "../../_App/YesNoModal";

const YesNoRentalModal = ({
  finishTime,
  price,
  listing,
  handleApprove,
  totalPrice,
  activeAcceptSendBookingRequest,
  setActiveAcceptSendBookingRequest,
}) => {
  let message = `'${listing.name}' complete task before ${fullDateConverter(
    finishTime
  )} and get ${moneyFormatVisual(price)}, total amount of ${moneyFormatVisual(
    totalPrice
  )} (including fees).`;

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
