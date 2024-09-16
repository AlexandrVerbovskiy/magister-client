import React, { useRef, useState } from "react";

const DateInput = ({ value, name, onInput, min = null }) => {
  const inputRef = useRef(null);
  const [showedPicker, setShowedPicker] = useState(false);

  const showPicker = () => {
    if (!showedPicker) {
      inputRef.current.showPicker();
    }

    setShowedPicker(!showedPicker);
  };

  const handleInput = (e) => {
    onInput(e.target.value);
    setShowedPicker(false);
  };

  const handleBlur = () => {
    setShowedPicker(false);
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
