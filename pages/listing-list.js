import React, { useEffect } from "react";
import Footer from "../components/_App/Footer";
import ListingsWithMap from "../components/GridListings/ListingsWithMap";
import NavbarTwo from "../components/_App/NavbarTwo";
import { userSideProps } from "../middlewares";
import { getListingListOptions } from "../services";
import { baseTimeListPageParams } from "../utils";

const GridListingsFullMap = ({
  categories,
  items,
  options,
  countItems,
  authToken,
  needSubscriptionNewCategory,
  hasListings,
}) => (
  <>
    <NavbarTwo canShowSearch={false} />

    <ListingsWithMap
      authToken={authToken}
      categories={categories}
      pageProps={{ items, options, countItems }}
      needSubscriptionNewCategory={needSubscriptionNewCategory}
      hasListings={hasListings}
    />

    <Footer bgColor="bg-f5f5f5" />
  </>
);

const boostServerSideProps = async ({ baseSideProps, context }) => {
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

  const options = await getListingListOptions(
    {
      ...baseTimeListPageParams(context.query),
      cities,
      categories,
      clientIp,
      searchCity,
      searchCategory,
    },
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  userSideProps(context, boostServerSideProps);

export default GridListingsFullMap;
