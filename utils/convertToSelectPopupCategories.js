const convertToSelectPopupCategories = (categories) => {
  categories["firstLevel"].forEach(
    (category, index) =>
      (categories["firstLevel"][index]["countChildren"] = categories[
        "secondLevel"
      ].filter((subCategory) => subCategory.parentId == category.id).length)
  );

  categories["secondLevel"].forEach(
    (category, index) =>
      (categories["secondLevel"][index]["countChildren"] = categories[
        "thirdLevel"
      ].filter((subCategory) => subCategory.parentId == category.id).length)
  );

  categories["thirdLevel"].forEach(
    (category, index) => (categories["thirdLevel"][index]["countChildren"] = 0)
  );

  categories["firstLevel"].sort((a, b) => b.countChildren - a.countChildren);
  categories["secondLevel"].sort((a, b) => b.countChildren - a.countChildren);
  categories["thirdLevel"].sort((a, b) => b.countChildren - a.countChildren);

  return categories;
};

export default convertToSelectPopupCategories;
