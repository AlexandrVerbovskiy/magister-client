import React, { useRef, useState } from "react";
import STATIC from "../../static";

const PriceRangeSlider = ({
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  handleChangePrices,
}) => {
  const minLimit = STATIC.MIN_PRICE_LIMIT;
  const maxLimit = STATIC.MAX_PRICE_LIMIT;
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
          <div className="price-input">
            <div className="price-field">
              <input
                type="number"
                className="min-input"
                value={minPrice}
                step="1"
                onChange={handleMinChange}
              />
            </div>
            <div className="price-field">
              <input
                type="number"
                className="max-input"
                value={maxPrice}
                step="1"
                onChange={handleMaxChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
