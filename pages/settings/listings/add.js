import React, { useState, useContext } from "react";

import { authSideProps } from "../../../middlewares";
import { createListing, getCreateListingOptions } from "../../../services";

import EditForm from "../../../components/Listings/EditForm";

const AddListing = ({ categories }) => {
  const [listing, setListing] = useState({});

  const save = async (formData, authToken) => {
    const res = await createListing(formData, authToken);
    const listingId = res.listingId;
    const newLinkPart =
      window.location.origin + "/settings/listings/update/" + listingId;
    window.history.replaceState(null, null, newLinkPart);
    setListing(res);
    return res;
  };

  return (
    <EditForm
      categories={categories}
      listing={listing}
      save={save}
      messageOnSuccess="Created successfully"
    />
  );
};

export const getServerSideProps = async (context) => {
  const baseSideProps = await authSideProps(context);

  if (baseSideProps.notFound) {
    return {
      notFound: true,
    };
  }

  try {
    const options = await getCreateListingOptions(
      baseSideProps.props.authToken
    );

    return {
      props: { ...baseSideProps.props, ...options },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

export default AddListing;
