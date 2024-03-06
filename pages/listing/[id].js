import React from "react";
import NavbarTwo from "../../components/_App/NavbarTwo";
import Footer from "../../components/_App/Footer";
import SingleListingsContent from "../../components/SingleListings/SingleListingsContent";
import { userSideProps } from "../../middlewares";
import { getFullListingInfo } from "../../services";

const Listing = ({ listing }) => {
  return (
    <>
      <NavbarTwo />

      <SingleListingsContent listing={listing} />

      <Footer bgColor="bg-f5f5f5" />
    </>
  );
};

const boostServerSideProps = async ({ context }) => {
  const id = context.params.id;
  const listing = await getFullListingInfo(id);

  if (!listing) {
    return {
      notFound: true,
    };
  }

  return { listing, id };
};

export const getServerSideProps = (context) =>
  userSideProps(context, boostServerSideProps);

export default Listing;
