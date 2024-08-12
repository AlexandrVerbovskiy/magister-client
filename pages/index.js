import React from "react";
import Navbar from "../components/_App/Navbar";
import Banner from "../components/HomeOne/Banner";
import Footer from "../components/_App/Footer";
import { userSideProps } from "../middlewares";
import { getIndexOptions } from "../services";
import YourBusiness from "../components/HomeOne/YourBusiness";
import Category from "../components/HomeOne/Category";
import DestinationsTwo from "../components/Common/DestinationsTwo";
import Feedback from "../components/Common/Feedback";
import SafeWithUs from "../components/Common/SafeWithUs";
import BeforeTheRental from "../components/Common/BeforeTheRental";
import DuringRental from "../components/Common/DuringRental";

const Index = ({ categories }) => {
  const popularCategories = [];
  let topCategories = [];
  const maxTopCategoriesSectionView = 8;

  categories["firstLevel"].map((category) => {
    if (category.popular) {
      popularCategories.push(category.name);
    }

    topCategories.push(category);
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

      <Category
        topCategories={topCategories}
        needShowMore={moreCategoriesThanView}
        bgColor="bg-f9f9f9"
      />

      <Feedback />

      <DestinationsTwo bgColor="bg-f9f9f9" />

      <SafeWithUs />

      <BeforeTheRental />

      <DuringRental />

      {/*<ListingArea listings={topListings} />*/}

      <Footer />
    </>
  );
};

const boostServerSideProps = async ({ baseSideProps }) => {
  const options = await getIndexOptions(baseSideProps.authToken);
  return { ...options };
};

export const getServerSideProps = (context) =>
  userSideProps({ context, callback: boostServerSideProps });

export default Index;
