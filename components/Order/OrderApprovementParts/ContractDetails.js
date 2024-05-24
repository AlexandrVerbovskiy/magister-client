import { autoMultiEnding, getDaysDifference, moneyFormat, timeConverter } from "../../../utils";
import Switch from "../../FormComponents/Switch";

const ContractDetails = ({
  feeActive,
  setFeeActive,
  fromDate,
  toDate,
  price,
  fee,
}) => {
  const duration = getDaysDifference(fromDate, toDate);
  const subtotalPrice = price * duration;
  const totalFee = (subtotalPrice * fee) / 100;
  const totalPrice = subtotalPrice + totalFee;

  return (
    <div className="listings-widget listings_contact_details">
      <h3>Rental Details</h3>

      <div>
        <div className="date-fee-switch">
          <Switch
            title="Fee-free option"
            active={feeActive}
            onChange={setFeeActive}
          />
        </div>
        <div>
          <div
            className="d-flex"
            style={{ marginTop: "20px", marginBottom: "20px" }}
          >
            <div className="date-info">
              <div className="date-info-label">Withdrawal</div>
              <div className="date-info-value">{timeConverter(fromDate)}</div>
            </div>
            <div className="date-info">
              <div className="date-info-label">Devolution</div>
              <div className="date-info-value">{timeConverter(toDate)}</div>
            </div>
          </div>
        </div>
        <div
          className="d-flex justify-content-between"
          style={{ marginTop: "10px", marginBottom: "10px" }}
        >
          <div>
            ${price} x {duration} {autoMultiEnding(duration, "day")}
          </div>
          <div>${moneyFormat(subtotalPrice)}</div>
        </div>

        <div
          className="d-flex justify-content-between"
          style={{ marginTop: "10px", marginBottom: "10px" }}
        >
          <div>Service Fee</div>
          <div>${moneyFormat(totalFee)}</div>
        </div>
      </div>

      <ul>
        <li className="d-flex justify-content-between px-0">
          <div>Total:</div> <div>${moneyFormat(totalPrice)}</div>
        </li>
      </ul>
    </div>
  );
};

export default ContractDetails;
