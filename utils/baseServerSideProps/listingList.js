import { baseTimeListPageParams } from "../listPageParams";

const listingList = (context) => {
  const { categories: baseCategories = [], cities: baseCities = [] } =
    context.query;

  const clientIp =
    context.req.headers["x-forwarded-for"] ||
    context.req.connection.remoteAddress;

  const categories = [];
  const cities = [];

  if (typeof baseCategories == "string") {
    categories.push(baseCategories);
  } else {
    baseCategories.forEach((category) => categories.push(category));
  }

  if (typeof baseCities == "string") {
    cities.push(baseCities);
  } else {
    baseCities.forEach((city) => cities.push(city));
  }

  const minPrice = context.query["min-price"];
  const maxPrice = context.query["max-price"];
  const searchCity = context.query["search-city"];
  const searchCategory = context.query["search-category"];
  const distance = context.query["distance"];

  return {
    ...baseTimeListPageParams(context.query),
    itemsPerPage: 6,
    cities,
    categories,
    clientIp,
    searchCity,
    searchCategory,
    distance,
    minPrice,
    maxPrice,
  };
};

export default listingList;
