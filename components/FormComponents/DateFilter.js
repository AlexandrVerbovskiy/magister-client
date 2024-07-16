import { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import { dateToSeconds, getMaxFlatpickrDate } from "../../utils";
//import "flatpickr/dist/flatpickr.min.css";

const DateFilter = ({ value, onChange, placeholder = "Filter date" }) => {
  const [pickerValue, setPickerValue] = useState(value);

  useEffect(() => {
    setPickerValue(value);
  }, [value]);

  const options = {
    mode: "range",
    static: true,
    monthSelectorType: "static",
    dateFormat: "M j, Y",
    defaultDate: [
      new Date(new Date().getTime() - dateToSeconds(6)),
      new Date(),
    ],
    maxDate: getMaxFlatpickrDate(),
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
    <div className="flatpickr-parent-wrapper flatpickr-date-filter">
      <Flatpickr
        value={pickerValue}
        options={options}
        onClose={onClose}
        placeholder={placeholder}
      />

      <div className="reset-date-filter" onClick={resetDate}>
        <svg viewBox="0 0 16 16">
          <path d="M12.8,4.8L11.2,3.2L8,6.4L4.8,3.2L3.2,4.8L6.4,8L3.2,11.2L4.8,12.8L8,9.6L11.2,12.8L12.8,11.2L9.6,8L12.8,4.8Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default DateFilter;
