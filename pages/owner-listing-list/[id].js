import React, { useState, useContext, useEffect, useRef } from "react";
import Footer from "../../components/_App/Footer";
import ListingsWithMap from "../../components/GridListings/ListingsWithMap";
import NavbarTwo from "../../components/_App/NavbarTwo";
import { userSideProps } from "../../middlewares";
import {
  getOwnerListingList,
  getOwnerListingListOptions,
} from "../../services";
import { listingListBaseServerSideProps } from "../../utils";
import { IndiceContext } from "../../contexts";
import { useRouter } from "next/router";

const GridListingsFullMap = (baseProps) => {
  const router = useRouter();
  const [props, setProps] = useState(baseProps);
  const [authToken, setAuthToken] = useState(baseProps.authToken);
  const { authToken: sessionAuthToken } = useContext(IndiceContext);
  const firstUpdateRef = useRef(true);

  useEffect(() => {
    setAuthToken(sessionAuthToken);
  }, [sessionAuthToken]);

  const onOwnerIdUpdate = async (ownerId) => {
    const newProps = await getOwnerListingListOptions(
      { ...props.options, ownerId },
      authToken
    );
    setProps(newProps);
  };

  useEffect(() => {
    if (firstUpdateRef.current) {
      firstUpdateRef.current = false;
    } else {
      onOwnerIdUpdate(router.query.id);
    }
  }, [router.query.id]);

  return (
    <>
      <NavbarTwo />

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
  userSideProps(context, boostServerSideProps);

export default GridListingsFullMap;
