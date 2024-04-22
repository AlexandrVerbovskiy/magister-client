import React, { useEffect } from "react";
import Footer from "../../components/_App/Footer";
import ListingsWithMap from "../../components/GridListings/ListingsWithMap";
import NavbarTwo from "../../components/_App/NavbarTwo";
import { userSideProps } from "../../middlewares";
import {
  getOwnerListingList,
  getOwnerListingListOptions,
} from "../../services";
import { listingListBaseServerSideProps } from "../../utils";

const GridListingsFullMap = ({
  categories,
  items,
  options,
  countItems,
  authToken,
  hasListings,
}) => (
  <>
    <NavbarTwo canShowSearch={false} />

    <ListingsWithMap
      authToken={authToken}
      categories={categories}
      pageProps={{ items, options, countItems }}
      needSubscriptionNewCategory={false}
      hasListings={hasListings}
      ownerId={options.userId}
      getListingListRequest={getOwnerListingList}
    />

    <Footer bgColor="bg-f5f5f5" />
  </>
);

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const id = context.params.id;

  const options = await getOwnerListingListOptions(
    { ...listingListBaseServerSideProps(context), ownerId: id },
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  userSideProps(context, boostServerSideProps);

export default GridListingsFullMap;
