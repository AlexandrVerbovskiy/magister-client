import React, { useState } from "react";
import { generateQrCode, paymentTest } from "../services/paymentRequests";

const Test = () => {
  const [img, setImg] = useState(null);

  const handleClick = async () => {
    await paymentTest();
  };

  return (
    <div>
      <button onClick={handleClick}>Click</button>
      {img && <img width="400px" height="400px" src={img} />}
    </div>
  );
};

export default Test;
