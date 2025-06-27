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
import UnlockAccess from "../components/Common/UnlockAccess";
import StartEarning from "../components/Common/StartEarning";
import { objStringSort, stringSort } from "../utils";

const Index = ({ categories }) => {
  const popularCategories = [];
  let topCategories = [];
  const maxTopCategoriesSectionView = 9;

  categories["firstLevel"].map((category) => {
    if (category.popular) {
      popularCategories.push(category.name);
    }

    topCategories.push(category);
  });

  objStringSort(topCategories, "name");
  topCategories = topCategories.slice(0, maxTopCategoriesSectionView);

  return (
    <>
      <Navbar canShowSearch={false} />

      <Banner popularCategories={popularCategories} />

      <SafeWithUs />

      <Category topCategories={topCategories} />

      <YourBusiness />

      <UnlockAccess />

      <StartEarning />

      <DestinationsTwo bgColor="bg-f9f9f9" />

      <Footer />
    </>
  );
};

const boostServerSideProps = async ({ baseSideProps }) => {
  const options = await getIndexOptions(baseSideProps.authToken);
  return { ...options, pageLoading: true };
};

export const getServerSideProps = (context) =>
  userSideProps({ context, callback: boostServerSideProps });

export default Index;
