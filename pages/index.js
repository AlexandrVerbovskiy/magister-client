import React, { useContext, useEffect } from "react";
import Navbar from "../components/_App/Navbar";
import Banner from "../components/HomeOne/Banner";
import Footer from "../components/_App/Footer";
import { IndiceContext } from "../contexts";
import { userSideProps } from "../middlewares";
import { getIndexOptions } from "../services";

const Index = ({ popularCategories }) => {
  const { setLoading } = useContext(IndiceContext);

  useEffect(() => {
    setLoading(false);
  });

  return (
    <>
      <Navbar canShowSearch={false} />

      <Banner popularCategories={popularCategories} />

      <Footer />
    </>
  );
};

//saveListingCategories

export const getServerSideProps = async (context) => {
  const baseSideProps = await userSideProps(context);

  if (baseSideProps.notFound) {
    return {
      notFound: true,
    };
  }

  const options = await getIndexOptions();

  return {
    props: { ...baseSideProps.props, ...options },
  };
};

export default Index;
