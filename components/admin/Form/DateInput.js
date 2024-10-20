import Flatpickr from "react-flatpickr";
import React, { useEffect, useState } from "react";
import { getMaxFlatpickrDate } from "../../../utils";
import ErrorSpan from "../ErrorSpan";

const DateInput = ({
  label = null,
  value,
  name,
  placeholder,
  setValue,
  error,
  setError,
  labelClassName = "sr-only",
  inputClassName = "form-input w-full",
}) => {
  const [pickerValue, setPickerValue] = useState(value ? [value] : []);

  useEffect(() => {
    setPickerValue(value ? [value] : []);
  }, [value]);

  const options = {
    mode: "single",
    static: true,
    monthSelectorType: "static",
    dateFormat: "M j, Y H:i",
<<<<<<< HEAD
    enableTime: false,
    time_24hr: false,
=======
    enableTime: true,
    time_24hr: true,
>>>>>>> ebc90ab (listing updated)
    prevArrow:
      '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
    nextArrow:
      '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
    maxDate: getMaxFlatpickrDate(),
<<<<<<< HEAD
    minDate: "today",
=======
>>>>>>> ebc90ab (listing updated)
    onChange: (selectedDates) => {
      const date = selectedDates[0];

      const formattedDate = date ? date.toISOString() : null;

      setPickerValue(date ? [date] : []);
      setValue(formattedDate);
      setError(null);
    },
  };

  return (
    <>
      {label && <label className={labelClassName}>{label}</label>}

      <div className="w-full relative">
        <Flatpickr
          value={pickerValue}
          options={options}
          placeholder={placeholder}
          name={name}
          className={inputClassName}
        />
      </div>

      <ErrorSpan error={error} />
    </>
  );
};

export default DateInput;
