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

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const id = context.params.id;
  const options = await getUpdateListingOptions(
    id,
    baseSideProps.authToken
  );

  return { ...options, id };
};

export const getServerSideProps = (context) =>
  authSideProps(context, boostServerSideProps);

export default UpdateListing;
