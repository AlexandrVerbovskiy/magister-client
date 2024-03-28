import React, { useState, useRef, useEffect } from "react";
import useSearchCategory from "./useSearchCategory";
import useSearchCity from "./useSearchCity";

const useCategoryCity = ({ baseCity = "", baseCategory = "" } = {}) => {
  const categoryFilterRef = useRef(null);
  const cityFilterRef = useRef(null);

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
    categoryFilterRef.current.blur();
    setSearchCategory(value);
    updateCategoryTips(value);
  };

  const handleChangeCity = (e) => {
    const newCity = e.target.value;
    updateCityTips(newCity);
    setSearchCity(newCity);
  };

  const handleCityTipClick = (value) => {
    cityFilterRef.current.blur();
    setSearchCity(value);
    updateCityTips(value);
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
  };
};

export default useCategoryCity;
