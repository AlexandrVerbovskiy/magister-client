import { dateConverter, moneyFormat } from "../../../utils";
import YesNoModal from "../../_App/YesNoModal";
import STATIC from "../../../static";

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

  message += `for ${STATIC.CURRENCY}${moneyFormat(
    price
  )} per day, total amount of ${STATIC.CURRENCY}${moneyFormat(
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
