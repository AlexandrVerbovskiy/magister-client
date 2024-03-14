const leveliseCategories = (groupedCategories) => {
  const { firstLevel=[], secondLevel=[], thirdLevel=[] } = groupedCategories;
  
  const categories = firstLevel.map((elem) => ({
    ...elem,
    children: secondLevel
      .filter((sElem) => sElem.parentId === elem.id)
      .map((sElem) => ({
        ...sElem,
        children: thirdLevel.filter((tElem) => tElem.parentId === sElem.id),
      })),
  }));

  return categories;
};

export default leveliseCategories;
