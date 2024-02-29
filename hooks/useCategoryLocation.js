import React, { useState, useRef } from "react";
import useSearchCategory from "./useSearchCategory";

const useCategoryLocation = () => {
  const categoryFilterRef = useRef(null);
  const {
    tipsPopupActive,
    categoryTips,
    openCategoryTipsPopup,
    closeCategoryTipsPopup,
    updateCategoryTips,
  } = useSearchCategory();

  const [searchCategory, setSearchCategory] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

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

  const handleChangeLocation = (e) => {
    const newLocation = e.target.value;
    setSearchLocation(newLocation);
  };

  return {
    handleChangeLocation,
    handleCategoryTipClick,
    handleChangeCategory,
    searchCategory,
    searchLocation,
    tipsPopupActive,
    categoryTips,
    openCategoryTipsPopup,
    closeCategoryTipsPopup,
    categoryFilterRef,
  };
};

export default useCategoryLocation;
