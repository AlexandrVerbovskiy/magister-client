import React from "react";
import NavbarTwo from "../../components/_App/NavbarTwo";
import Footer from "../../components/_App/Footer";
import SingleListingsContent from "../../components/SingleListings/SingleListingsContent";
import { userSideProps } from "../../middlewares";
import { getListingFullByIdOptions } from "../../services";

const Listing = ({ listing, tenantBaseCommissionPercent, comments }) => {
  return (
    <>
      <NavbarTwo />

      <SingleListingsContent
        listing={listing}
        comments={comments}
        tenantBaseCommissionPercent={tenantBaseCommissionPercent}
      />

      <Footer bgColor="bg-f5f5f5" />
    </>
  );
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const id = context.params.id;
  const options = await getListingFullByIdOptions(id, baseSideProps.authToken);

  return { ...options, id };
};

export const getServerSideProps = (context) =>
  userSideProps(context, boostServerSideProps);

export default Listing;
