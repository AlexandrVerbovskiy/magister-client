import { dateConverter, moneyFormatVisual } from "../../../utils";
import YesNoModal from "../../_App/YesNoModal";

const YesNoRentalModal = ({
  fromDate,
  toDate,
  price,
  listing,
  handleApprove,
  totalPrice,
  activeAcceptSendBookingRequest,
  setActiveAcceptSendBookingRequest,
}) => {
  let message = `'${listing.name}' rental`;

  if (new Date(fromDate).toDateString() == new Date(toDate).toDateString()) {
    message += ` during ${dateConverter(fromDate)} `;
  } else {
    message += ` from ${dateConverter(fromDate)} to ${dateConverter(toDate)} `;
  }

  message += `for ${moneyFormatVisual(
    price
  )} per day, total amount of ${moneyFormatVisual(
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
