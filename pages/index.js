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

const boostServerSideProps = async () => {
  const options = await getIndexOptions();
  return { ...options };
};

export const getServerSideProps = (context) =>
  userSideProps(context, boostServerSideProps);

export default Index;
