import cloneObject from "./cloneObject";
import { initOthersCategory } from "./helpers";
import { sortCategoriesByName } from "./sort";

const convertToSelectPopupCategories = (categories, needOthers = false) => {
  const newCategories = cloneObject(categories);

  newCategories["firstLevel"].forEach(
    (category, index) =>
      (newCategories["firstLevel"][index]["countChildren"] = newCategories[
        "secondLevel"
      ].filter((subCategory) => subCategory.parentId == category.id).length)
  );

  newCategories["secondLevel"].forEach(
    (category, index) =>
      (newCategories["secondLevel"][index]["countChildren"] = newCategories[
        "thirdLevel"
      ].filter((subCategory) => subCategory.parentId == category.id).length)
  );

  newCategories["thirdLevel"].forEach(
    (category, index) =>
      (newCategories["thirdLevel"][index]["countChildren"] = 0)
  );

  newCategories["firstLevel"] = sortCategoriesByName(
    newCategories["firstLevel"]
  );
  
  newCategories["secondLevel"] = sortCategoriesByName(
    newCategories["secondLevel"]
  );

  newCategories["thirdLevel"] = sortCategoriesByName(
    newCategories["thirdLevel"]
  );

  if (needOthers) {
    newCategories["firstLevel"].push(
      initOthersCategory({
        level: 1,
        parentId: null,
        image: "/images/three-dots.svg",
        customImage: true
      })
    );

    newCategories["firstLevel"].forEach((firstLevelCategory) => {
      if (!firstLevelCategory.isOther && firstLevelCategory.countChildren) {
        newCategories["secondLevel"].push(
          initOthersCategory({
            level: 2,
            parentId: firstLevelCategory.id,
            image: firstLevelCategory.image,
          })
        );
      }
    });
    newCategories["secondLevel"].forEach((secondLevelCategory) => {
      if (!secondLevelCategory.isOther && secondLevelCategory.countChildren) {
        newCategories["thirdLevel"].push(
          initOthersCategory({
            level: 3,
            parentId: secondLevelCategory.id,
            image: secondLevelCategory.image,
          })
        );
      }
    });
  }

  return newCategories;
};

export default convertToSelectPopupCategories;
