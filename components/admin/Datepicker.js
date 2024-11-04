import React, { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import { getMaxFlatpickrDate } from "../../utils";

function Datepicker({ align, value, onChange, placeholder = "From - To" }) {
  const [pickerValue, setPickerValue] = useState(value);

  useEffect(() => {
    setPickerValue(value);
  }, [value]);

  const options = {
    mode: "range",
    static: true,
    monthSelectorType: "static",
    dateFormat: "M j, Y",
    prevArrow:
      '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
    nextArrow:
      '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
    maxDate: getMaxFlatpickrDate(),
    minDate: "today",
    onReady: (selectedDates, dateStr, instance) => {
      instance.element.value = dateStr.replace("to", "-");
      const customClass = align ? align : "";
      instance.calendarContainer.classList.add(`flatpickr-${customClass}`);
    },
    onChange: (selectedDates, dateStr, instance) => {
      instance.element.value = dateStr.replace("to", "-");
      onChange(selectedDates);
    },
  };

  const onClose = (newValue) => {
    if (newValue.length < 2) {
      setPickerValue([]);
      setTimeout(() => setPickerValue(value));
    }
  };

  const resetDate = () => {
    setPickerValue(null);
    onChange([null, null], true);
  };

  return (
    <div className="relative">
      <Flatpickr
        className="form-input px-9 dark:bg-slate-800 text-slate-500 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-200 font-medium w-[15.5rem]"
        value={pickerValue}
        options={options}
        onClose={onClose}
        placeholder={placeholder}
      />
      <div className="absolute inset-0 right-auto flex items-center pointer-events-none">
        <svg
          className="w-4 h-4 fill-current text-slate-500 dark:text-slate-400 ml-3"
          viewBox="0 0 16 16"
        >
          <path d="M15 2h-2V0h-2v2H9V0H7v2H5V0H3v2H1a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V3a1 1 0 00-1-1zm-1 12H2V6h12v8z" />
        </svg>
      </div>

      <div
        className="absolute inset-0 left-auto flex items-center"
        onClick={resetDate}
        style={{ cursor: "pointer" }}
      >
        <svg
          className="w-4 h-4 fill-current opacity-50 shrink-0 mr-3"
          viewBox="0 0 16 16"
        >
          <path d="M12.8,4.8L11.2,3.2L8,6.4L4.8,3.2L3.2,4.8L6.4,8L3.2,11.2L4.8,12.8L8,9.6L11.2,12.8L12.8,11.2L9.6,8L12.8,4.8Z"></path>
        </svg>
      </div>
    </div>
  );
}

export default Datepicker;
