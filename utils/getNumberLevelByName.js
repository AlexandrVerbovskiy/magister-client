const getNumberLevelByName = (level) => {
  let numberLevel = 3;
  if (level == "firstLevel") numberLevel = 1;
  if (level == "secondLevel") numberLevel = 2;
  return numberLevel;
};

export default getNumberLevelByName;
