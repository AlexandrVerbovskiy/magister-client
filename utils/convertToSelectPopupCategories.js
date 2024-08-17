import cloneObject from "./cloneObject";
import { initOthersCategory } from "./helpers";

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

  newCategories["firstLevel"].sort((a, b) => b.countChildren - a.countChildren);
  newCategories["secondLevel"].sort(
    (a, b) => b.countChildren - a.countChildren
  );
  newCategories["thirdLevel"].sort((a, b) => b.countChildren - a.countChildren);

  if (needOthers) {
    newCategories["firstLevel"].push(initOthersCategory());
    newCategories["firstLevel"].forEach((firstLevelCategory) => {
      if (!firstLevelCategory.isOther && firstLevelCategory.countChildren) {
        newCategories["secondLevel"].push(
          initOthersCategory({ level: 2, parentId: firstLevelCategory.id })
        );
      }
    });
    newCategories["secondLevel"].forEach((secondLevelCategory) => {
      if (!secondLevelCategory.isOther && secondLevelCategory.countChildren) {
        newCategories["thirdLevel"].push(
          initOthersCategory({ level: 3, parentId: secondLevelCategory.id })
        );
      }
    });
  }

  return newCategories;
};

export default convertToSelectPopupCategories;
