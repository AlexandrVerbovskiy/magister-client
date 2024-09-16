import {
  autoMultiEnding,
  calculateFeeByDaysCount,
  getFactOrderDays,
  moneyFormatVisual,
} from "../../../utils";

const ContractDetailsLight = ({ fromDate, toDate, price, fee }) => {
  const duration = getFactOrderDays(fromDate, toDate);
  const subtotalPrice = price * duration;
  const totalFee = calculateFeeByDaysCount(duration, price, fee, true);
  const totalPrice = subtotalPrice + totalFee;

  return (
    <div className="listings-widget listings_contact_details">
      <h3>Rental Details</h3>

      <div>
        <div
          className="d-flex justify-content-between"
          style={{ marginTop: "10px", marginBottom: "10px" }}
        >
          <div>Rental period</div>

          <div>
            {duration} {autoMultiEnding(duration, "day")}
          </div>
        </div>

        <div
          className="d-flex justify-content-between"
          style={{ marginTop: "10px", marginBottom: "10px" }}
        >
          <div>
            {moneyFormatVisual(price)} x {duration}{" "}
            {autoMultiEnding(duration, "day")}
          </div>
          <div>{moneyFormatVisual(subtotalPrice)}</div>
        </div>

        <div
          className="d-flex justify-content-between"
          style={{ marginTop: "10px", marginBottom: "10px" }}
        >
          <div>Service Fee</div>
          <div>{moneyFormatVisual(totalFee)}</div>
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

export default ContractDetailsLight;
