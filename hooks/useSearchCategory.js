import { useContext, useState } from "react";
import { IndiceContext } from "../contexts";

const useSearchCategory = () => {
  const [tipsPopupActive, setTipsPopupActive] = useState(false);
  const { error, categories = {} } = useContext(IndiceContext);

  const [categoryTips, setCategoryTips] = useState([]);

  const openCategoryTipsPopup = (baseValue) => {
    setTipsPopupActive(true);
    updateCategoryTips(baseValue);
  };

  const closeCategoryTipsPopup = () => setTipsPopupActive(false);

  const updateCategoryTips = async (search) => {
    try {
      const firstLevelCategories = categories["firstLevel"] ?? [];

      const categoryNames = [
        ...firstLevelCategories
          .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
          .map((c) => c.name),
      ];
      setCategoryTips(categoryNames);
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
