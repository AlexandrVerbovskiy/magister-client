import React, { useContext, useEffect } from "react";
import Navbar from "../components/_App/Navbar";
import Banner from "../components/HomeOne/Banner";
import Footer from "../components/_App/Footer";
import { IndiceContext } from "../contexts";
import { userSideProps } from "../middlewares";
import { getIndexOptions } from "../services";
import Features from "../components/HomeOne/Features";
import ListingArea from "../components/Common/ListingArea";
import Category from "../components/HomeOne/Category";
import DestinationsTwo from "../components/Common/DestinationsTwo";
import Feedback from "../components/Common/Feedback";
import AppDownload from "../components/Common/AppDownload";
import Blog from "../components/Common/Blog";
import HowItWorks from "../components/Common/HowItWorks";
import BeforeTheRental from "../components/Common/BeforeTheRental";
import DuringRental from "../components/Common/DuringRental";

const Index = ({ topListings, categories }) => {
  const { setLoading } = useContext(IndiceContext);
  const popularCategories = [];
  let topCategories = [];
  const maxTopCategoriesSectionView = 11;

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

  useEffect(() => {
    setLoading(false);
  });

  return (
    <>
      <Navbar canShowSearch={true} />

      <Banner popularCategories={popularCategories} />

      <Features />

      <ListingArea listings={topListings} />

      <Category
        topCategories={topCategories}
        needShowMore={moreCategoriesThanView}
      />

      <DestinationsTwo />

      <Feedback />

      <HowItWorks bgColor="bg-f9f9f9" />

      <DuringRental />

      <BeforeTheRental />

      <Blog />

      <AppDownload />

      <Footer />
    </>
  );
};

const boostServerSideProps = async () => {
  const options = await getIndexOptions();
  return { ...options };
};

export const getServerSideProps = (context) =>
  userSideProps(context, boostServerSideProps);

export default Index;
