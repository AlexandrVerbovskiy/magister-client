import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import STATIC from "../../static";

const PhoneNumberInput = ({ value, setValue }) => {
  const [countryCode, setCountryCode] = useState("");
  const [isValid, setIsValid] = useState(true);

  const validatePhone = () => {
    if (value && isValidPhoneNumber(value, countryCode.toLocaleUpperCase())) {
      setIsValid(true);
      console.log("Valid phone number:", value);
    } else {
      setIsValid(false);
      console.log("Invalid phone number");
    }
  };

  useEffect(() => {
    const phoneNumber = parsePhoneNumberFromString(value);

    if (phoneNumber) {
      const country = phoneNumber.country;
      setCountryCode(country);
    } else {
      setCountryCode([STATIC.PHONE_COUNTRIES_CODES[0]]);
    }
  }, []);

  const handleChangePhone = (phone, countryData) => {
    setValue(phone);
    setCountryCode(countryData.countryCode);
  };

  return (
    <div>
      <PhoneInput
        country={countryCode}
        value={value}
        onChange={handleChangePhone}
        onlyCountries={STATIC.PHONE_COUNTRIES_CODES}
        prefix=""
      />
      <button onClick={validatePhone}>Validate Phone</button>
      {!isValid && (
        <p style={{ color: "red" }}>
          Invalid phone number for the selected country
        </p>
      )}
    </div>
  );
};

export default PhoneNumberInput;
