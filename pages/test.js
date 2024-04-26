import React, { useState } from "react";
import { generateQrCode } from "../services/paymentRequests";

const Test = () => {
  const [img, setImg] = useState(null);

  const handleClick = async () => {
    const res = await generateQrCode();
    setImg(res);
  };

  return (
    <div>
      <button onClick={handleClick}>Click</button>
      {img && <img width="400px" height="400px" src={img} />}
    </div>
  );
};

export default Test;
