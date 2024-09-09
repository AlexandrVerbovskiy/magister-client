import { useEffect, useState } from "react";
import PhoneNumberInput from "../components/FormComponents/PhoneInput";

const Test = () => {
  const [value, setValue] = useState("");

  useEffect(() => {
    console.log(value);
  }, [value]);

  return <PhoneNumberInput value={value} setValue={setValue} />;
};

export default Test;
