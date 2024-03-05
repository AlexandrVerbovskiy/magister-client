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

export const getServerSideProps = async (context) => {
  const baseSideProps = await userSideProps(context);
  const id = context.params.id;

  try {
    const listing = await getFullListingInfo(id);

    if (!listing) {
      return {
        notFound: true,
      };
    }

    return {
      props: { ...baseSideProps.props, listing, id },
    };
  } catch (e) {
    console.log(e);
    return {
      notFound: true,
    };
  }
};

export default Listing;
