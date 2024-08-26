import React, { useRef } from "react";
import { moneyFormatVisual } from "../../utils";

const PriceRangeSlider = ({
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  handleChangePrices,
  minLimit,
  maxLimit,
}) => {
  const rangeSlideRef = useRef();

  const handleMinChange = (event) => {
    let newMin = parseInt(event.target.value);
    let newMax = maxPrice;

    if (newMin > newMax) {
      [newMin, newMax] = [newMax, newMin];
    }

    handleChangePrices(newMin, newMax);
  };

  const handleMaxChange = (event) => {
    let newMax = parseInt(event.target.value);
    let newMin = minPrice;

    if (newMax < newMin) {
      [newMax, newMin] = [newMin, newMax];
    }

    handleChangePrices(newMin, newMax);
  };

  const handleMinSlide = (event) => {
    let newMin = parseInt(event.target.value);
    let newMax = maxPrice;

    if (newMin > newMax) {
      [newMin, newMax] = [newMax, newMin];
    }

    handleChangePrices(newMin, newMax);
  };

  const handleMaxSlide = (event) => {
    let newMax = parseInt(event.target.value);
    let newMin = minPrice;

    if (newMax < newMin) {
      [newMax, newMin] = [newMin, newMax];
    }

    handleChangePrices(newMin, newMax);
  };

  return (
    <div id="price-range">
      <div className="custom-wrapper">
        <div className="price-input-container mt-2">
          <div className="slider-container">
            <div
              className="price-slider"
              ref={rangeSlideRef}
              style={{
                left: `${(minPrice / maxLimit) * 100}%`,
                right: `${100 - (maxPrice / maxLimit) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="range-input">
          <input
            type="range"
            className="min-range"
            min={minLimit}
            max={maxLimit}
            value={minPrice}
            step="1"
            onChange={handleMinSlide}
          />
          <input
            type="range"
            className="max-range"
            min={minLimit}
            max={maxLimit}
            value={maxPrice}
            step="1"
            onChange={handleMaxSlide}
          />
        </div>

        <div className="price-input-container mt-4">
          From {moneyFormatVisual(minPrice)} to {moneyFormatVisual(maxPrice)}
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
