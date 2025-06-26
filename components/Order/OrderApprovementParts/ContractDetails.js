import { fullDateConverter, moneyFormatVisual } from "../../../utils";
import ErrorSpan from "../../ErrorSpan";

const ContractDetails = ({
  totalPrice,
  dateError,
  finishTime,
  startTime,
  totalFee,
}) => {
  return (
    <div className="listings-widget listings_contact_details">
      <h3>Task Details</h3>

      <div>
        <div style={{ marginTop: "20px", marginBottom: "20px" }}>
          <div className="d-flex">
            <DateInput
              label="Withdrawal"
              value={fromDate}
              setValue={setFromDate}
              blockedDates={blockedDates}
              setDateError={setDateError}
            />

            <DateInput
              label="Devolution"
              value={toDate}
              setValue={setToDate}
              blockedDates={blockedDates}
              setDateError={setDateError}
            />
          </div>
          <ErrorSpan className="d-block" error={dateError} />
        </div>
        <div
          className="d-flex justify-content-between"
          style={{ marginTop: "10px", marginBottom: "10px" }}
        >
          <div>Duration</div>
          <div>
            {fullDateConverter(startTime)} - {fullDateConverter(finishTime)}
          </div>
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

export default ContractDetails;
