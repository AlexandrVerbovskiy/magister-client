import React from "react";
import NavbarTwo from "../../components/_App/NavbarTwo";
import Footer from "../../components/_App/Footer";
import SingleListingsContent from "../../components/SingleListings/SingleListingsContent";
import { userSideProps } from "../../middlewares";
import { getListingFullByIdOptions } from "../../services";
import { useIdPage } from "../../hooks";

const Listing = (baseProps) => {
  const { props } = useIdPage({
    baseProps,
    getPagePropsFunc: ({ field, authToken }) =>
      getListingFullByIdOptions(field, authToken),
  });

  return (
    <>
      <NavbarTwo needMobile={false} />

      <SingleListingsContent
        listing={props.listing}
        comments={props.comments}
        renterBaseCommissionPercent={props.renterBaseCommissionPercent}
        ownerRatingInfo={props.ownerRatingInfo}
      />

      <Footer bgColor="bg-f5f5f5" />
    </>
  );
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const id = context.params.id;
  const options = await getListingFullByIdOptions(id, baseSideProps.authToken);
  return { ...options, id, pageTitle: options.listing?.name };
};

export const getServerSideProps = (context) =>
  userSideProps({
    context,
    callback: boostServerSideProps,
  });

export default Listing;
