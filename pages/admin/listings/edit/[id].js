import React, { useState } from "react";
import {
  getAdminListingEditPageOptions,
  updateListingByAdmin,
} from "../../../../services";
import { adminSideProps } from "../../../../middlewares";
import EditForm from "../../../../components/admin/Listings/EditForm";

const ListingEdit = ({ categories, listing: baseListing, id, defects }) => {
  const [listing, setListing] = useState(baseListing);

  const save = async (formData, authToken) => {
    formData.append("id", id);
    const res = await updateListingByAdmin(formData, authToken);
    const updatedListing = res.listing;
    setListing(updatedListing);
    return updatedListing;
  };

  return (
    <EditForm
      categories={categories}
      listing={listing}
      save={save}
      defects={defects}
    />
  );
};

const boostServerSideProps = async ({ context, baseSideProps }) => {
  const id = context.params.id;

  const options = await getAdminListingEditPageOptions(
    id,
    baseSideProps.authToken
  );

  return { ...options, id };
};

export const getServerSideProps = (context) =>
  adminSideProps(context, boostServerSideProps);

export default ListingEdit;
