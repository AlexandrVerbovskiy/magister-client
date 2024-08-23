import { useEffect, useRef, useState } from "react";
import useWindowSizeUpdate from "./useWindowSizeUpdate";
import { scrollToElementParent } from "../utils";

const getCategoryById = (id, categories) => {
  let result = {};

  Object.keys(categories).forEach((level) => {
    const resSearch =
      categories[level].filter((category) => category.id == id)[0] ?? null;

    if (resSearch) {
      result = resSearch;
    }
  });

  return result;
};

const useListingCategorySelect = ({
  active,
  selectedCategoryId,
  categories,
  setSelectedCategoryInfo,
  onChange,
  setActive,
  otherCategoryParentId,
  parentPadding = 0,
}) => {
  const firstLevelRef = useRef(null);
  const secondLevelRef = useRef(null);
  const thirdLevelRef = useRef(null);
  const [timer, setTimer] = useState(null);

  const [selectedByLevels, setSelectedByLevels] = useState({
    firstLevel: null,
    secondLevel: null,
    thirdLevel: null,
  });

  const initVisualCurrentCategoryList = (newCategoryId) => {
    const timerId = setTimeout(() => {
      let foundCategory = getCategoryById(newCategoryId, categories);

      if (foundCategory) {
        if (foundCategory.id == "-") {
          const parentCategory = getCategoryById(
            foundCategory.parentId,
            categories
          );

          if (parentCategory.level == 2) {
            handleScrollToSecondElement();
          }

          if (parentCategory.level == 3) {
            handleScrollToThirdElement();
          }
        } else {
          if (foundCategory.level == 2) {
            handleScrollToSecondElement();
          }

          if (foundCategory.level == 3) {
            handleScrollToThirdElement();
          }
        }
      }
    }, 200);

    if (timer) {
      clearTimeout(timer);
      setTimer(timerId);
    }
  };

  useEffect(() => {
    initVisualCurrentCategoryList(selectedCategoryId);
  }, [active]);

  useWindowSizeUpdate(
    () => initVisualCurrentCategoryList(selectedCategoryId),
    [selectedCategoryId]
  );

  useEffect(() => {
    let searchId = selectedCategoryId;
    let foundCategory = getCategoryById(searchId, categories);

    setSelectedCategoryInfo(foundCategory);

    do {
      Object.keys(categories).forEach((level) => {
        const foundCategory = categories[level].filter((category) => {
          if (searchId == "-") {
            return (
              category.parentId == otherCategoryParentId &&
              category.id == searchId
            );
          } else {
            return category.id == searchId;
          }
        })[0];

        if (foundCategory) {
          searchId = foundCategory.parentId;

          setSelectedByLevels((prev) => {
            const res = { ...prev };
            res[level] = foundCategory.id;
            return res;
          });
        }
      });
    } while (searchId);
  }, [selectedCategoryId]);

  const handleScrollToFirstElement = () => {
    scrollToElementParent(firstLevelRef.current, "horizontal", parentPadding);
  };

  const handleScrollToSecondElement = () => {
    scrollToElementParent(secondLevelRef.current, "horizontal", parentPadding);
  };

  const handleScrollToThirdElement = () => {
    scrollToElementParent(thirdLevelRef.current, "horizontal", parentPadding);
  };

  const handleOptionClick = (
    categoryId,
    level,
    hasChild = false,
    parentId = null
  ) => {
    if (
      !hasChild ||
      (!categoryId &&
        (level == "firstLevel" || !selectedByLevels["firstLevel"]))
    ) {
      onChange(categoryId, parentId);
      setActive(false);
      setSelectedByLevels((prev) => {
        const result = { ...prev };

        if (level == "firstLevel") {
          result["firstLevel"] = categoryId;
          result["secondLevel"] = null;
          result["thirdLevel"] = null;
        }

        if (level == "secondLevel") {
          result["secondLevel"] = categoryId;
          result["thirdLevel"] = null;
        }

        if (level == "thirdLevel") {
          result["thirdLevel"] = categoryId;
        }

        return result;
      });
      return;
    }

    if (!categoryId) {
      if (level == "thirdLevel") {
        categoryId =
          selectedByLevels["secondLevel"] ?? selectedByLevels["firstLevel"];
      }

      if (level == "secondLevel") {
        categoryId = selectedByLevels["firstLevel"];
      }

      onChange(categoryId);
      setActive(false);
      setSelectedByLevels({
        firstLevel: null,
        secondLevel: null,
        thirdLevel: null,
      });
      return;
    }

    setSelectedByLevels((prev) => {
      let res = { ...prev };
      res[level] = categoryId;

      if (level == "firstLevel") {
        res = { ...res, secondLevel: null, thirdLevel: null };
      }

      if (level == "secondLevel") {
        res = { ...res, thirdLevel: null };
      }

      return res;
    });

    if (level == "firstLevel") {
      handleScrollToSecondElement();
    }

    if (level == "secondLevel") {
      handleScrollToThirdElement();
    }
  };

  return {
    selectedByLevels,
    firstLevelRef,
    secondLevelRef,
    thirdLevelRef,
    handleScrollToFirstElement,
    handleScrollToSecondElement,
    handleScrollToThirdElement,
    handleOptionClick,
  };
};

export default useListingCategorySelect;
