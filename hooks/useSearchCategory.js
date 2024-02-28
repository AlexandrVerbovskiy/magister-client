import React, {useState} from "react";
import { getSearchTips } from "../services";

const useSearchCategory = () => {
  const [tipsPopupActive, setTipsPopupActive] = useState(false);
  const [categoryTips, setCategoryTips] = useState([]);

  const openCategoryTipsPopup = () => setTipsPopupActive(true);

  const closeCategoryTipsPopup = () => setTipsPopupActive(false);

  const updateCategoryTips = async (search) => {
    const tips = await getSearchTips(search);
    setCategoryTips(tips);
  };

  return {
    tipsPopupActive,
    categoryTips,
    openCategoryTipsPopup,
    closeCategoryTipsPopup,
    updateCategoryTips,
  };
};

export default useSearchCategory;
