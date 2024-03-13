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
import DestinationsTwo from '../components/Common/DestinationsTwo';
import Feedback from '../components/Common/Feedback';
import HowItWorks from '../components/Common/HowItWorks';

const Index = ({ categoriesInfos, topListings }) => {
  const { setLoading } = useContext(IndiceContext);
  const popularCategories = categoriesInfos
    .filter((item) => item.popular)
    .map((item) => item.name);

  useEffect(() => {
    setLoading(false);
  });

  return (
    <>
      <Navbar canShowSearch={false} />

      <Banner popularCategories={popularCategories} />

      <Features />

      <ListingArea listings={topListings} />

      <Category categoriesInfos={categoriesInfos} />

      <DestinationsTwo />

      <Feedback />

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
