import React, { useState } from "react";

import { authSideProps } from "../../../../middlewares";
import { getUpdateListingOptions, updateListing } from "../../../../services";
import EditForm from "../../../../components/Listings/EditForm";

const UpdateListing = ({
  categories,
  listing: baseListing,
  id,
  lastRequestInfo = {},
  canChange,
  defects,
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
    const updatedListing = res.listing;
    setListing(updatedListing);
    setCanSendRequest(!res.createdVerifiedRequest);
    return updatedListing;
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
      canChange={canChange}
      defects={defects}
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
