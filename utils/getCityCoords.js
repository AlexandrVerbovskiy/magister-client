import STATIC from "../static";

const getCityCoords = (city) => {
  let cityCoords = null;

  if (city) {
    const cityLowerCase = city.toLowerCase();

    Object.keys(STATIC.CITY_COORDS).forEach((coordsKey) => {
      if (coordsKey.toLowerCase() == cityLowerCase) {
        cityCoords = STATIC.CITY_COORDS[coordsKey];
      }
    });
  }

  if (cityCoords) {
    return cityCoords;
  }

  return STATIC.DEFAULTS.CITY_COORDS;
};

export default getCityCoords;
