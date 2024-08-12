import React, { useState } from "react";
import {
  getAdminListingEditPageOptions,
  updateListingByAdmin,
} from "../../../../services";
import { adminSideProps } from "../../../../middlewares";
import EditForm from "../../../../components/admin/Listings/EditForm";
import { useIdPage } from "../../../../hooks";

const ListingEdit = (baseProps) => {
  const { props } = useIdPage({
    baseProps,
    getPagePropsFunc: ({ field, authToken }) =>
      getAdminListingEditPageOptions(field, authToken),
    onUpdate: (newProps) => setListing(newProps.listing),
  });

  const [listing, setListing] = useState(props.listing);

  const save = async (formData, authToken) => {
    formData.append("id", props.id);
    const res = await updateListingByAdmin(formData, authToken);
    const updatedListing = res.listing;
    setListing(updatedListing);
    return updatedListing;
  };

  return (
    <EditForm categories={props.categories} listing={listing} save={save} />
  );
};

const boostServerSideProps = async ({ context, baseSideProps }) => {
  const id = context.params.id;

  const options = await getAdminListingEditPageOptions(
    id,
    baseSideProps.authToken
  );

  return { ...options, id, pageTitle: `Listing #${id}` };
};

export const getServerSideProps = (context) =>
  adminSideProps({ context, callback: boostServerSideProps });

export default ListingEdit;
