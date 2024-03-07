import React, { useState, useContext } from "react";

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
  const [canSendRequest, setCanSendRequest] = useState(true);

  const router = useRouter();

  const save = async (formData, authToken) => {
    if (listing.listingId) {
      formData.append("id", id);
      const res = await updateListing(formData, authToken);
      setListing(res);
      return res;
    } else {
      const res = await createListing(formData, authToken);
      const listingId = res.listingId;
      const newLinkPart =
        window.location.origin + "/settings/listings/update/" + listingId;
      router.replace(newLinkPart);
      setListing(res);
      setCanSendRequest(true);
      return res;
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
    />
  );
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const options = await getCreateListingOptions(baseSideProps.authToken);

  return { ...options };
};

export const getServerSideProps = (context) =>
  authSideProps(context, boostServerSideProps);

export default AddListing;
