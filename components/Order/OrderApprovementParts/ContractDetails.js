import {
  dateConverter,
  fullDateConverter,
  getFactOrderDays,
  getPriceByDays,
  moneyFormatVisual,
  renterPaysCalculate,
  renterPaysFeeCalculate,
} from "../../../utils";
import ErrorSpan from "../../ErrorSpan";

const ContractDetails = ({ price, dateError, finishDate, startDate, fee }) => {
  const clearPrice = getPriceByDays(price, startDate, finishDate);
  const totalPrice = renterPaysCalculate(clearPrice, fee);

  return (
    <div className="listings-widget listings_contact_details">
      <h3>Rental Details</h3>

      <div>
        <div style={{ marginTop: "20px", marginBottom: "20px" }}>
          <ErrorSpan className="d-block" error={dateError} />
        </div>
        <div
          className="d-flex justify-content-between"
          style={{ marginTop: "10px", marginBottom: "10px" }}
        >
          <div>Duration</div>
          <div>
            {dateConverter(startDate)} - {dateConverter(finishDate)}
          </div>
        </div>

        <div
          className="d-flex justify-content-between"
          style={{ marginTop: "10px", marginBottom: "10px" }}
        >
          <div>Price</div>
          <div>
            {getFactOrderDays(startDate, finishDate)} x{" "}
            {moneyFormatVisual(clearPrice)}
          </div>
        </div>

        <div
          className="d-flex justify-content-between"
          style={{ marginTop: "10px", marginBottom: "10px" }}
        >
          <div>Service Fee</div>
          <div>
            {moneyFormatVisual(renterPaysFeeCalculate(clearPrice, fee))}
          </div>
        </div>
      </div>

      <ul>
        <li className="d-flex justify-content-between px-0">
          <div>Total:</div> <div>{moneyFormatVisual(totalPrice)}</div>
        </li>
      </ul>
    </div>
  );
};

export default ContractDetails;
