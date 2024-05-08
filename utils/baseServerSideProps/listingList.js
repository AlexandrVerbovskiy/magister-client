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

  const searchCity = context.query["search-city"];
  const searchCategory = context.query["search-category"];

  return {
    ...baseTimeListPageParams(context.query),
    cities,
    categories,
    clientIp,
    searchCity,
    searchCategory,
  };
};

export default listingList;