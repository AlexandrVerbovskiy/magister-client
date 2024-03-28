import React, { useEffect } from "react";
import Footer from "../components/_App/Footer";
import ListingsWithMap from "../components/GridListings/ListingsWithMap";
import NavbarTwo from "../components/_App/NavbarTwo";
import { userSideProps } from "../middlewares";
import { getListingListOptions } from "../services";

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
  const fromTime = context.query["from-time"];
  const toTime = context.query["to-time"];

  const options = await getListingListOptions(
    {
      ...context.query,
      clientTime: Date.now(),
      cities,
      categories,
      clientIp,
      searchCity,
      searchCategory,
      fromTime,
      toTime,
    },
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  userSideProps(context, boostServerSideProps);

export default GridListingsFullMap;
