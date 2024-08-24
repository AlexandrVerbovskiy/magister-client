import React from "react";
import Footer from "../../components/_App/Footer";
import ListingsWithMap from "../../components/GridListings/ListingsWithMap";
import NavbarTwo from "../../components/_App/NavbarTwo";
import { userSideProps } from "../../middlewares";
import {
  getOwnerListingList,
  getOwnerListingListOptions,
} from "../../services";
import { listingListBaseServerSideProps } from "../../utils";
import { useIdPage } from "../../hooks";

const GridListingsFullMap = (baseProps) => {
  const { authToken, props } = useIdPage({
    baseProps,
    getPagePropsFunc: ({ field, authToken, currentProps }) =>
      getOwnerListingListOptions(
        { ...currentProps.options, ownerId: field },
        authToken
      ),
  });

  return (
    <>
      <ListingsWithMap
        authToken={authToken}
        categories={props.categories}
        pageProps={{
          items: props.items,
          options: props.options,
          countItems: props.countItems,
        }}
        needSubscriptionNewCategory={false}
        hasListings={props.hasListings}
        ownerId={props.options.userId}
        getListingListRequest={getOwnerListingList}
        priceLimits={props.priceLimits}
      />

      <Footer bgColor="bg-f5f5f5" />
    </>
  );
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const id = context.params.id;

  const options = await getOwnerListingListOptions(
    { ...listingListBaseServerSideProps(context), ownerId: id },
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  userSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "Listings" },
  });

export default GridListingsFullMap;
