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
      const link = `/listing-list`;

      if (window.location.pathname.includes("/listing-list/")) {
        router.push(link).then(() => router.reload());
      } else {
        router.push(link);
      }
    }

    Object.keys(categories).forEach((level) => {
      categories[level].forEach((category) => {
        if (category.id === categoryId) {
          const link = `/listing-list?categories=${category.name}`;

          if (window.location.pathname.includes("/listing-list/")) {
            router.push(link).then(() => router.reload());
          } else {
            router.push(link);
          }
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
