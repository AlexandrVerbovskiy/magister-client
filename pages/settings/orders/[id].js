import React from "react";
import NavbarTwo from "../../../components/_App/NavbarTwo";
import Footer from "../../../components/_App/Footer";
import { authSideProps } from "../../../middlewares";
import { getOrderFullByIdOptions } from "../../../services";
import OrderContent from "../../../components/Order/OrderContent";

const Listing = (props) => {
  return (
    <>
      <NavbarTwo />

      <OrderContent {...props} />

      <Footer bgColor="bg-f5f5f5" />
    </>
  );
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const id = context.params.id;
  const options = await getOrderFullByIdOptions(id, baseSideProps.authToken);
  return { ...options, id };
};

export const getServerSideProps = (context) =>
  authSideProps(context, boostServerSideProps);

export default Listing;
