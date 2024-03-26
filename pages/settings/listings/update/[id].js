import React, { useState } from "react";

import { authSideProps } from "../../../../middlewares";
import { getUpdateListingOptions, updateListing } from "../../../../services";
import EditForm from "../../../../components/Listings/EditForm";

const UpdateListing = ({
  categories,
  listing: baseListing,
  id,
  lastRequestInfo = {},
}) => {
  const baseCanSendRequest =
    !baseListing.approved &&
    (!lastRequestInfo || lastRequestInfo.approved !== null);
  const baseRejectDescription = lastRequestInfo.rejectDescription;

  const [listing, setListing] = useState(baseListing);
  const [canSendRequest, setCanSendRequest] = useState(baseCanSendRequest);
  const [rejectDescription, setRejectDescription] = useState(
    baseRejectDescription
  );

  const save = async (formData, authToken) => {
    formData.append("id", id);
    const res = await updateListing(formData, authToken);
    setListing(res);
    setCanSendRequest(false);
    return res;
  };

  return (
    <EditForm
      categories={categories}
      listing={listing}
      save={save}
      messageOnSuccess="Updated successfully"
      canSendRequest={canSendRequest}
      setCanSendRequest={setCanSendRequest}
      rejectDescription={rejectDescription}
      clearRejectDescription={() => setRejectDescription(null)}
    />
  );
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const id = context.params.id;
  const options = await getUpdateListingOptions(id, baseSideProps.authToken);
  return { ...options, id };
};

export const getServerSideProps = (context) =>
  authSideProps(context, boostServerSideProps);

export default UpdateListing;
