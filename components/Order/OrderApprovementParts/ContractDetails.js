import flatpickr from "flatpickr";
import {
  autoMultiEnding,
  separateDate,
  getMaxFlatpickrDate,
  moneyFormatVisual,
} from "../../../utils";
import { useEffect, useRef } from "react";
import ErrorSpan from "../../ErrorSpan";

const DateInput = ({ value, setValue, label, blockedDates, setDateError }) => {
  const flatpickrRef = useRef(null);
  const flatpickrContainerRef = useRef(null);

  const openDatePicker = () => {
    flatpickrRef.current.open();
  };

  const handleInputDate = (dates) => {
    const newLocalValue = dates[0];
    setValue(separateDate(newLocalValue));
    setDateError(null);
  };

  useEffect(() => {
    flatpickrRef.current = flatpickr(flatpickrContainerRef.current, {
      dateFormat: "Y-m-d",
      disable: blockedDates,
      minDate: "today",
      defaultDate: [value],
      static: true,
      maxDate: getMaxFlatpickrDate(),
      onChange: (selectedDates, dateStr, instance) => {
        instance.element.value = dateStr;
        handleInputDate(selectedDates);
      },
    });
  }, [JSON.stringify(blockedDates)]);

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
  needFeeSwitch = false,
  feeActive = null,
  setFeeActive = null,
  blockedDates = [],
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
