import cloneObject from "./cloneObject";

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
    newCategories["firstLevel"].push({
      countChildren: 0,
      id: "-",
      image: null,
      level: 1,
      name: "Others",
      orderIndex: null,
      parentId: null,
      popular: false,
    });
  }

  return newCategories;
};

export default convertToSelectPopupCategories;
