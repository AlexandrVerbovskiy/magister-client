import React, { useEffect } from "react";
import Footer from "../components/_App/Footer";
import PopularPlacesFilter from "../components/Common/PopularPlacesFilter";
import ListingsWithMap from "../components/GridListings/ListingsWithMap";
import NavbarTwo from "../components/_App/NavbarTwo";
import { userSideProps } from "../middlewares";
import { getListingListOptions } from "../services";

const GridListingsFullMap = ({
  categories,
  items,
  options,
  countItems,
  canSendCreateNotifyRequest,
  authToken,
}) => (
  <>
    <NavbarTwo />

    <PopularPlacesFilter />

    <ListingsWithMap
      authToken={authToken}
      categories={categories}
      pageProps={{ items, options, countItems }}
      canSendCreateNotifyRequest={canSendCreateNotifyRequest}
    />

    <Footer bgColor="bg-f5f5f5" />
  </>
);

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const { categories: baseCategories = [], cities: baseCities = [] } =
    context.query;

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

  const options = await getListingListOptions(
    {
      ...context.query,
      clientTime: Date.now(),
      cities,
      categories,
    },
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  userSideProps(context, boostServerSideProps);

export default GridListingsFullMap;