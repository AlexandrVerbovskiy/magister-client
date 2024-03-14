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

const Index = ({ topCategories, topListings, categories }) => {
  const { setLoading } = useContext(IndiceContext);
  const popularCategories = [];

  Object.keys(categories).forEach((level) => {
    categories[level].map((category) => {
      if (category.popular) {
        popularCategories.push(category.name);
      }
    });
  });

  useEffect(() => {
    setLoading(false);
  });

  return (
    <>
      <Navbar canShowSearch={false} />

      <Banner popularCategories={popularCategories} />

      <Features />

      <ListingArea listings={topListings} />

      <Category topCategories={topCategories} />

      <DestinationsTwo />

      <Feedback />

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
