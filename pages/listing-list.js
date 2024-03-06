import React from "react";
import Footer from "../components/_App/Footer";
import PopularPlacesFilter from "../components/Common/PopularPlacesFilter";
import ListingsWithMap from "../components/GridListings/ListingsWithMap";
import NavbarTwo from "../components/_App/NavbarTwo";
import { userSideProps } from "../middlewares";
import { getListingListOptions } from "../services";

const GridListingsFullMap = ({ categories }) => {
  return (
    <>
      <NavbarTwo canShowSearch={false} />

      <PopularPlacesFilter />

      <ListingsWithMap categories={categories} />

      <Footer bgColor="bg-f5f5f5" />
    </>
  );
};

const boostServerSideProps = async () => {
  const options = await getListingListOptions();
  return { ...options };
};

export const getServerSideProps = (context) =>
  userSideProps(context, boostServerSideProps);

export default GridListingsFullMap;
