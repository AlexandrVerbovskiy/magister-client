import React, { useContext, useState } from "react";
import { getSearchTips } from "../services";
import { IndiceContext } from "../contexts";

const useSearchCategory = () => {
  const [tipsPopupActive, setTipsPopupActive] = useState(false);
  const [categoryTips, setCategoryTips] = useState([]);

  const { error } = useContext(IndiceContext);

  const openCategoryTipsPopup = (baseValue) => {
    setTipsPopupActive(true);
    updateCategoryTips(baseValue);
  };

  const closeCategoryTipsPopup = () => setTipsPopupActive(false);

  const updateCategoryTips = async (search) => {
    try {
      const tips = await getSearchTips(search);
      setCategoryTips(tips);
    } catch (e) {
      error.set(e.message);
    }
  };

  return {
    categoryTipsPopupActive: tipsPopupActive,
    categoryTips,
    openCategoryTipsPopup,
    closeCategoryTipsPopup,
    updateCategoryTips,
  };
};

export default useSearchCategory;
