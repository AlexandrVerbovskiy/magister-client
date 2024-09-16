import React, { useState } from "react";

import { authSideProps } from "../../../../middlewares";
import { getUpdateListingOptions, updateListing } from "../../../../services";
import EditForm from "../../../../components/Listings/EditForm";
import { useIdPage } from "../../../../hooks";

const getBaseCanSendRequest = (props) =>
  !props.listing.approved &&
  (!props.lastRequestInfo || props.lastRequestInfo.approved !== null);

const getRejectDescription = (props) => props.lastRequestInfo.rejectDescription;

const UpdateListing = (baseProps) => {
  const { props } = useIdPage({
    baseProps,
    getPagePropsFunc: ({ field, authToken }) =>
      getUpdateListingOptions(field, authToken),
    onUpdate: (newProps) => {
      setCanSendRequest(getBaseCanSendRequest(newProps));
      setRejectDescription(getRejectDescription(newProps));
    },
  });

  const [listing, setListing] = useState(props.listing);
  const [canSendRequest, setCanSendRequest] = useState(
    getBaseCanSendRequest(props)
  );
  const [rejectDescription, setRejectDescription] = useState(
    getRejectDescription(props)
  );

  const save = async (formData, authToken) => {
    formData.append("id", props.id);
    const res = await updateListing(formData, authToken);
    const updatedListing = res.listing;
    setListing(updatedListing);
    setCanSendRequest(!res.createdVerifiedRequest);
    return updatedListing;
  };

  return (
    <EditForm
      categories={props.categories}
      listing={listing}
      save={save}
      messageOnSuccess="Updated successfully"
      canSendRequest={canSendRequest}
      setCanSendRequest={setCanSendRequest}
      rejectDescription={rejectDescription}
      clearRejectDescription={() => setRejectDescription(null)}
      canChange={props.canChange}
    />
  );
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const id = context.params.id;
  const options = await getUpdateListingOptions(id, baseSideProps.authToken);
  return { ...options, id, pageTitle: options.listing?.name };
};

export const getServerSideProps = (context) =>
  authSideProps({ context, callback: boostServerSideProps });

export default UpdateListing;
