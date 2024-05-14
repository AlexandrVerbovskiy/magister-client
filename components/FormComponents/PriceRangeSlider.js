import React, { useRef, useState } from "react";

const PriceRangeSlider = () => {
  const minLimit = 1;
  const maxLimit = 100;
  const [minPrice, setMinPrice] = useState(minLimit);
  const [maxPrice, setMaxPrice] = useState(maxLimit);
  const rangeSlideRef = useRef();

  const handleMinChange = (event) => {
    let newMin = parseInt(event.target.value);
    let newMax = maxPrice;

    if (newMin > newMax) {
      [newMin, newMax] = [newMax, newMin];
    }

    setMinPrice(newMin);
    setMaxPrice(newMax);
  };

  const handleMaxChange = (event) => {
    let newMax = parseInt(event.target.value);
    let newMin = minPrice;

    if (newMax < newMin) {
      [newMax, newMin] = [newMin, newMax];
    }

    setMaxPrice(newMax);
    setMinPrice(newMin);
  };

  const handleMinSlide = (event) => {
    let newMin = parseInt(event.target.value);
    let newMax = maxPrice;

    if (newMin > newMax) {
      [newMin, newMax] = [newMax, newMin];
    }

    setMinPrice(newMin);
    setMaxPrice(newMax);
  };

  const handleMaxSlide = (event) => {
    let newMax = parseInt(event.target.value);
    let newMin = minPrice;

    if (newMax < newMin) {
      [newMax, newMin] = [newMin, newMax];
    }

    setMaxPrice(newMax);
    setMinPrice(newMin);
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
