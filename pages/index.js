import React, { useContext, useEffect } from "react";
import Navbar from "../components/_App/Navbar";
import Banner from "../components/HomeOne/Banner";
import Footer from "../components/_App/Footer";
import { userSideProps } from "../middlewares";
import { getIndexOptions } from "../services";
import YourBusiness from "../components/HomeOne/YourBusiness";
import ListingArea from "../components/Common/ListingArea";
import Category from "../components/HomeOne/Category";
import DestinationsTwo from "../components/Common/DestinationsTwo";
import Feedback from "../components/Common/Feedback";
import AppDownload from "../components/Common/AppDownload";
import Blog from "../components/Common/Blog";
import SafeWithUs from "../components/Common/SafeWithUs";
import BeforeTheRental from "../components/Common/BeforeTheRental";
import DuringRental from "../components/Common/DuringRental";
import HowItWorks from "../components/HomeOne/HowItWorks";

const Index = ({ categories }) => {
  const popularCategories = [];
  let topCategories = [];
  const maxTopCategoriesSectionView = 8;

  Object.keys(categories).forEach((level) => {
    categories[level].map((category) => {
      if (category.popular) {
        popularCategories.push(category.name);
      }

      topCategories.push(category);
    });
  });

  topCategories.sort((a, b) => a.countListings - b.countListings);
  const moreCategoriesThanView =
    topCategories.length > maxTopCategoriesSectionView;
  topCategories = topCategories.slice(0, maxTopCategoriesSectionView);

  return (
    <>
      <Navbar canShowSearch={false} />

      <Banner popularCategories={popularCategories} />

      <YourBusiness />

      <Feedback bgColor="bg-f9f9f9" />

      <SafeWithUs />

      <Category
        topCategories={topCategories}
        needShowMore={moreCategoriesThanView}
      />

      <BeforeTheRental />

      <DuringRental />

      {/*<ListingArea listings={topListings} />*/}

      <DestinationsTwo bgColor="bg-f9f9f9" />

      <Footer />
    </>
  );
};

const boostServerSideProps = async ({ baseSideProps }) => {
  const options = await getIndexOptions(baseSideProps.authToken);
  return { ...options };
};

export const getServerSideProps = (context) =>
  userSideProps(context, boostServerSideProps);

export default Index;
