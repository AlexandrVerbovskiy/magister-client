import { baseTimeListPageParams } from "../listPageParams";

const listingList = (context) => {
  const { categories: baseCategories = [], cities: baseCities = [] } =
    context.query;

  const baseOthersCategories = context.query["others-categories"] ?? [];

  const clientIp =
    context.req.headers["x-forwarded-for"] ||
    context.req.connection.remoteAddress;

  const categories = [];
  const cities = [];
  const othersCategories = [];

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

  if (typeof baseOthersCategories == "string") {
    othersCategories.push(baseOthersCategories);
  } else {
    baseOthersCategories.forEach((othersCategory) =>
      othersCategories.push(othersCategory)
    );
  }

  const minPrice = context.query["min-price"];
  const maxPrice = context.query["max-price"];
  const searchCity = context.query["search-city"];
  const searchCategory = context.query["search-category"];
  const searchListing = context.query["search-listing"];
  const totalOthersCategories = !!context.query["total-others-categories"];
  const distance = context.query["distance"];
  const favorites = context.query["favorites"];

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
    totalOthersCategories,
    searchListing,
    favorites,
    othersCategories,
  };
};

export default listingList;
