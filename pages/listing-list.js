import React, { useEffect } from "react";
import Footer from "../components/_App/Footer";
import ListingsWithMap from "../components/GridListings/ListingsWithMap";
import NavbarTwo from "../components/_App/NavbarTwo";
import { userSideProps } from "../middlewares";
import { getListingListOptions } from "../services";
import { listingListBaseServerSideProps } from "../utils";
import { getListingList } from "../services";

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
      getListingListRequest={getListingList}
    />

    <Footer bgColor="bg-f5f5f5" />
  </>
);

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const options = await getListingListOptions(
    listingListBaseServerSideProps(context),
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  userSideProps(context, boostServerSideProps);

export default GridListingsFullMap;
