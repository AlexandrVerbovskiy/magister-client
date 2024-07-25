import { useState } from "react";
import { validatePrice } from "../../utils";
import BaseModal from "../_App/BaseModal";
import InputWithIcon from "../FormComponents/InputWithIcon";

const OfferOwnPrice = ({
  offerPriceActive,
  setOfferPriceActive,
  price,
  setPrice,
}) => {
  const [offerPrice, setOfferPrice] = useState(price);
  const [offerPriceError, setOfferPriceError] = useState(null);

  const handleSubmit = () => {
    let hasError = false;

    if (!offerPrice) {
      setOfferPriceError("Required field");
      hasError = true;
    }

    if (offerPrice && validatePrice(offerPrice) !== true) {
      setOfferPriceError(validatePrice(offerPrice));
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setPrice(Number(offerPrice));
    setOfferPriceActive(false);
  };

  const handleChangePrice = (e) => {
    const newPrice = e.target.value;
    setOfferPrice(newPrice);
    setOfferPriceError(null);
  };

  return (
    <BaseModal
      className="make-order-modal"
      active={offerPriceActive}
      closeModal={() => setOfferPriceActive(false)}
    >
      <span className="sub-title mb-2">
        <span>Offer Your Price</span>
      </span>

      <InputWithIcon
        type="number"
        value={offerPrice}
        error={offerPriceError}
        label="Your proposal price per day:"
        placeholder="532.00"
        onInput={handleChangePrice}
        name="proposal-price"
      />

      <div className="mt-3 offer-own-booking-price">
        <button
          className="mt-4 default-modal-button"
          type="button"
          onClick={handleSubmit}
        >
          Save Price
        </button>
      </div>
    </BaseModal>
  );
};

export default OfferOwnPrice;
