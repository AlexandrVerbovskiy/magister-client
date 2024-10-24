import React, { useRef, useState } from "react";

const DateInput = ({ value, name, placeholder, onInput, inline = true }) => {
  const [pickerValue, setPickerValue] = useState(value ? [value] : []);

  const showPicker = () => {
    if (!showedPicker) {
      inputRef.current.showPicker();
    }

  const options = {
    mode: "single",
    inline,
    static: true,
    monthSelectorType: "static",
    dateFormat: "M j, Y H:i",
    enableTime: true,
    time_24hr: true,
    prevArrow:
      '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
    nextArrow:
      '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
    maxDate: getMaxFlatpickrDate(),
    onChange: (selectedDates) => {
      const date = selectedDates[0];

      const formattedDate = date ? date.toISOString() : null;

      setPickerValue(date ? [date] : []);
      onInput(formattedDate);
    },
  };

  return (
    <input
      ref={inputRef}
      className="date-input"
      type="date"
      value={value}
      onChange={handleInput}
      name={name}
      id={name}
      onClick={showPicker}
      min={min}
      onBlur={handleBlur}
    />
  );
};

export default DateInput;
