import { useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const DateFilter = ({ value, onChange }) => {
  const [pickerValue, setPickerValue] = useState(value);

  const options = {
    mode: "range",
    static: true,
    monthSelectorType: "static",
    dateFormat: "M j, Y",
    defaultDate: [new Date().setDate(new Date().getDate() - 6), new Date()],
    onReady: (selectedDates, dateStr, instance) => {
      instance.element.value = dateStr.replace("to", "-");
    },
    onChange: (selectedDates, dateStr, instance) => {
      instance.element.value = dateStr.replace("to", "-");
      onChange(selectedDates);
    },
    onClose: (newValue) => {
      if (newValue.length < 2) {
        setPickerValue([]);
        setTimeout(() => setPickerValue(value));
      }
    },
  };

  return (
    <div className="flatpickr-parent-wrapper flatpickr-date-filter">
      <Flatpickr value={pickerValue} options={options} />
    </div>
  );
};

export default DateFilter;
