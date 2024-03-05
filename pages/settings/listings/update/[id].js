import React, { useState } from "react";

import { authSideProps } from "../../../../middlewares";
import { getUpdateListingOptions, updateListing } from "../../../../services";
import EditForm from "../../../../components/Listings/EditForm";

const UpdateListing = ({ categories, listing: baseListing, id }) => {
  const [listing, setListing] = useState(baseListing);

  const save = async (formData, authToken) => {
    formData.append("id", id);
    const res = await updateListing(formData, authToken);
    setListing(res);
    return res;
  };

  return (
    <EditForm
      categories={categories}
      listing={listing}
      save={save}
      messageOnSuccess="Updated successfully"
    />
  );
};

export const getServerSideProps = async (context) => {
  const baseSideProps = await authSideProps(context);
  const id = context.params.id;

  if (baseSideProps.notFound || !id) {
    return {
      notFound: true,
    };
  }

  try {
    const options = await getUpdateListingOptions(
      id,
      baseSideProps.props.authToken
    );

    return {
      props: { ...baseSideProps.props, ...options, id },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

export default UpdateListing;
