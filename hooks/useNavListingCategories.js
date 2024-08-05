import { useContext, useState } from "react";
import { IndiceContext } from "../contexts";
import { convertToSelectPopupCategories } from "../utils";
import { useRouter } from "next/router";

const useNavListingCategories = () => {
  const router = useRouter();
  const { categories = {} } = useContext(IndiceContext);
  const categoriesLength = Object.values(categories).reduce(
    (acc, curr) => acc + curr.length,
    0
  );

  const navbarCategories = convertToSelectPopupCategories(categories);
  const [activePopup, setActivePopup] = useState(false);

  const handleChangeCategory = (categoryId = null) => {
    if (!categoryId) {
      router.push(`/listings/`);
      return;
    }

    Object.keys(categories).forEach((level) => {
      categories[level].forEach((category) => {
        if (category.id === categoryId) {
          const link = `/listings/?categories=${encodeURIComponent(
            category.name
          )}`;
          router.push(link);
        }
      });
    });
  };

  const handleListingClick = (e) => {
    e.preventDefault();
    setActivePopup(true);
  };

  return {
    navbarCategories,
    handleChangeCategory,
    handleListingClick,
    categoriesLength,
    activePopup,
    setActivePopup,
  };
};

export default useNavListingCategories;
