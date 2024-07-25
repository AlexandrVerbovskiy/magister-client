const sortCategories = (categories) => {
  categories.sort((a, b) => {
    if (!b.popular && a.popular) {
      return -1;
    }

    if (b.popular && !a.popular) {
      return 1;
    }

    if (a.orderIndex > b.orderIndex) {
      return 1;
    }

    if (a.orderIndex < b.orderIndex) {
      return -1;
    }

    if (a.orderIndex !== null && b.orderIndex === null) {
      return 1;
    }

    if (a.orderIndex === null && b.orderIndex !== null) {
      return -1;
    }

    return 0;
  });

  return categories;
};

const leveliseCategories = (groupedCategories) => {
  const {
    firstLevel = [],
    secondLevel = [],
    thirdLevel = [],
  } = groupedCategories;

  sortCategories(firstLevel);
  sortCategories(secondLevel);
  sortCategories(thirdLevel);

  const categories = firstLevel.map((elem) => ({
    ...elem,
    children: secondLevel
      .filter((sElem) => sElem.parentId === elem.id)
      .map((sElem) => ({
        ...sElem,
        children: thirdLevel.filter((tElem) => tElem.parentId === sElem.id),
      })),
  }));

  categories.push({
    children: [],
    id: "-",
    image: null,
    level: 1,
    name: "Others",
    orderIndex: null,
    parentId: null,
    popular: false,
  });

  return categories;
};

export default leveliseCategories;
