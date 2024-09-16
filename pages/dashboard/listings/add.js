import React, { useState } from "react";
import { authSideProps } from "../../../middlewares";
import {
  createListing,
  getCreateListingOptions,
  updateListing,
} from "../../../services";
import EditForm from "../../../components/Listings/EditForm";
import { useRouter } from "next/router";

const AddListing = ({ categories }) => {
  const [listing, setListing] = useState({});
  const [canSendRequest, setCanSendRequest] = useState(false);

  const router = useRouter();

  const save = async (formData, authToken) => {
    if (listing.listingId) {
      formData.append("id", listing.listingId);
      const res = await updateListing(formData, authToken);
      const updatedListing = res.listing;

      setListing(updatedListing);
      setCanSendRequest(!res.createdVerifiedRequest);

      return updatedListing;
    } else {
      const res = await createListing(formData, authToken);
      const createdListing = res.listing;
      const listingId = createdListing.listingId;

      router.replace("/dashboard/listings/update/" + listingId, undefined, {
        shallow: true,
      });
      setListing(createdListing);
      setCanSendRequest(!res.createdVerifiedRequest);

      return createdListing;
    }
  };

  return (
    <EditForm
      categories={categories}
      listing={listing}
      save={save}
      messageOnSuccess="Created successfully"
      canSendRequest={canSendRequest}
      setCanSendRequest={setCanSendRequest}
      canChange={true}
    />
  );
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const options = await getCreateListingOptions(baseSideProps.authToken);
  return { ...options };
};

export const getServerSideProps = (context) =>
  authSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "Create Listing" },
  });

export default AddListing;
