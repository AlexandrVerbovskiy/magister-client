import flatpickr from "flatpickr";
import {
  autoMultiEnding,
  separateDate,
  getMaxFlatpickrDate,
  moneyFormatVisual,
} from "../../../utils";
import { useEffect, useRef } from "react";
import ErrorSpan from "../../ErrorSpan";

const DateInput = ({ value, setValue, label, setDateError }) => {
  const flatpickrRef = useRef(null);
  const flatpickrContainerRef = useRef(null);

  const openDatePicker = () => {
    flatpickrRef.current.open();
  };

  return (
    <div className="date-info" onClick={openDatePicker}>
      <div className="date-info-label">{label}</div>
      <div className="date-info-value">
        <input ref={flatpickrContainerRef} />
      </div>
    </div>
  );
};

const ContractDetails = ({
  fromDate,
  toDate,
  price,
  setToDate,
  setFromDate,
  totalPrice,
  subtotalPrice,
  dateError,
  duration,
  totalFee,
  setDateError,
}) => {
  return (
    <div className="listings-widget listings_contact_details">
      <h3>Rental Details</h3>

      <div>
        {/*needFeeSwitch && (
          <div className="date-fee-switch">
            <Switch
              title="Fee-free option"
              active={feeActive}
              onChange={setFeeActive}
            />
          </div>
        )*/}
        <div style={{ marginTop: "20px", marginBottom: "20px" }}>
          <ErrorSpan className="d-block" error={dateError} />
        </div>
        <div
          className="d-flex justify-content-between"
          style={{ marginTop: "10px", marginBottom: "10px" }}
        >
          <div>
            {moneyFormatVisual(price)} x {duration} {autoMultiEnding(duration, "day")}
          </div>
          <div>
            {moneyFormatVisual(subtotalPrice)}
          </div>
        </div>

        <div
          className="d-flex justify-content-between"
          style={{ marginTop: "10px", marginBottom: "10px" }}
        >
          <div>Service Fee</div>
          <div>
            {moneyFormatVisual(totalFee)}
          </div>
        </div>
      </div>

      <ul>
        <li className="d-flex justify-content-between px-0">
          <div>Total:</div>{" "}
          <div>
            {moneyFormatVisual(totalPrice)}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default ContractDetails;
