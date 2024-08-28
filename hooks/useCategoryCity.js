import React, { useState, useRef, useEffect } from "react";
import useSearchCategory from "./useSearchCategory";
import useSearchCity from "./useSearchCity";

const useCategoryCity = ({
  selectedCategories = [],
  selectedCities = [],
  categories = {},
  cities = [],
  baseSearchCity = "",
  baseSearchCategory = "",
  baseListing = "",
} = {}) => {
  let notFoundCategory = "";
  let notFoundCity = "";

  selectedCategories.forEach((selectedCategory) => {
    let countFound = 0;

    Object.keys(categories).forEach((categoryLevel) => {
      categories[categoryLevel].forEach((category) => {
        if (category.name.toLowerCase() === selectedCategory.toLowerCase()) {
          countFound++;
        }
      });
    });

    if (!countFound) {
      notFoundCategory = selectedCategory;
    }
  });

  selectedCities.forEach((selectedCity) => {
    let countFound = 0;

    cities.forEach((city) => {
      if (city.name.toLowerCase() === selectedCity.toLowerCase()) {
        countFound++;
      }
    });

    if (!countFound) {
      notFoundCity = selectedCity;
    }
  });

  const baseCity = baseSearchCity ?? notFoundCity;
  const baseCategory = baseSearchCategory ?? notFoundCategory;
  baseListing = baseListing ?? "";

  const categoryFilterRef = useRef(null);
  const cityFilterRef = useRef(null);
  const [searchListingName, setSearchListingName] = useState(baseListing);

  const {
    categoryTipsPopupActive,
    categoryTips,
    openCategoryTipsPopup,
    closeCategoryTipsPopup,
    updateCategoryTips,
  } = useSearchCategory();

  const {
    cityTipsPopupActive,
    cityTips,
    openCityTipsPopup,
    closeCityTipsPopup,
    updateCityTips,
  } = useSearchCity();

  const [searchCategory, setSearchCategory] = useState(baseCategory);
  const [searchCity, setSearchCity] = useState(baseCity);

  useEffect(() => {
    setSearchCity(baseCity);
  }, [baseCity]);

  useEffect(() => {
    setSearchCategory(baseCategory);
  }, [baseCategory]);

  const handleChangeCategory = (e) => {
    const newValue = e.target.value;
    updateCategoryTips(newValue);
    setSearchCategory(newValue);
  };

  const handleCategoryTipClick = (value) => {
    setSearchCategory(value);
    updateCategoryTips(value);
    categoryFilterRef.current.blur();
  };

  const handleChangeCity = (e) => {
    const newCity = e.target.value;
    updateCityTips(newCity);
    setSearchCity(newCity);
  };

  const handleCityTipClick = (value) => {
    setSearchCity(value);
    updateCityTips(value);
    cityFilterRef.current.blur();
  };

  const handleChangeSearchListingName = (e) => {
    const newName = e.target.value;
    setSearchListingName(newName);
  };

  return {
    handleChangeCity,
    handleCategoryTipClick,
    handleChangeCategory,
    handleCityTipClick,
    searchCategory,
    searchCity,
    categoryTipsPopupActive,
    categoryTips,
    cityTipsPopupActive,
    cityTips,
    openCityTipsPopup,
    closeCityTipsPopup,
    openCategoryTipsPopup,
    closeCategoryTipsPopup,
    categoryFilterRef,
    cityFilterRef,
    handleChangeSearchListingName,
    searchListingName,
  };
};

export default useCategoryCity;
