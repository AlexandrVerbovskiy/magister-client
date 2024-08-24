import React, { useContext, useEffect, useState } from "react";
import Footer from "../../components/_App/Footer";
import ListingsWithMap from "../../components/GridListings/ListingsWithMap";
import NavbarTwo from "../../components/_App/NavbarTwo";
import { userSideProps } from "../../middlewares";
import { getListingListOptions, getListingList } from "../../services";
import { listingListBaseServerSideProps } from "../../utils";
import { IndiceContext } from "../../contexts";

const GridListingsFullMap = ({
  categories,
  items,
  options,
  countItems,
  authToken: baseAuthToken,
  needSubscriptionNewCategory,
  hasListings,
  priceLimits,
}) => {
  const [authToken, setAuthToken] = useState(baseAuthToken);
  const { authToken: sessionAuthToken } = useContext(IndiceContext);

  useEffect(() => {
    setAuthToken(sessionAuthToken);
  }, [sessionAuthToken]);

  return (
    <>
      <ListingsWithMap
        authToken={authToken}
        categories={categories}
        pageProps={{ items, options, countItems }}
        needSubscriptionNewCategory={needSubscriptionNewCategory}
        hasListings={hasListings}
        getListingListRequest={getListingList}
        priceLimits={priceLimits}
      />

      <Footer bgColor="bg-f5f5f5" />
    </>
  );
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const options = await getListingListOptions(
    listingListBaseServerSideProps(context),
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
