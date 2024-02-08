import React, { useContext, useEffect } from "react";
import Navbar from "../components/_App/Navbar";
import Banner from "../components/HomeOne/Banner";
import Footer from "../components/_App/Footer";
import { IndiceContext } from "../contexts";

const Index = () => {
  const { setLoading } = useContext(IndiceContext);

  useEffect(() => {
    setLoading(false);
  });

  return (
    <>
      <Navbar />

      <Banner />

      <Footer />
    </>
  );
};

export default Index;
