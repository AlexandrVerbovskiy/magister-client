import React from "react";
import Footer from "../components/_App/Footer";
import PopularPlacesFilter from "../components/Common/PopularPlacesFilter";
import ListingsWithMap from "../components/GridListings/ListingsWithMap";
import NavbarTwo from "../components/_App/NavbarTwo";
import { userSideProps } from "../middlewares";

const GridListingsFullMap = () => {
  return (
    <>
      <NavbarTwo canShowSearch={false}/>

      <PopularPlacesFilter />

      <ListingsWithMap />

      <Footer bgColor="bg-f5f5f5" />
    </>
  );
};

export const getServerSideProps = userSideProps;

export default GridListingsFullMap;
