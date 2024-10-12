import Flatpickr from "react-flatpickr";
import React, { useEffect, useState } from "react";
import { getMaxFlatpickrDate } from "../../utils";

const DateInput = ({ value, name, placeholder, onInput }) => {
  const [pickerValue, setPickerValue] = useState(value ? [value] : []);

  useEffect(() => {
    setPickerValue(value ? [value] : []);
  }, [value]);

  const options = {
    mode: "single",
    static: true,
    monthSelectorType: "static",
    dateFormat: "M j, Y",
    prevArrow:
      '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
    nextArrow:
      '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
    maxDate: getMaxFlatpickrDate(),
    onChange: (selectedDates) => {
      const date = selectedDates[0];
      setPickerValue(date ? [date] : []);
      onInput(date);
    },
  };

  return (
    <div className="w-100">
      <Flatpickr
        value={pickerValue}
        options={options}
        placeholder={placeholder}
        name={name}
        className="form-control d-flex align-items-center cursor-pointer w-100"
      />
    </div>
  );
};

export default DateInput;
