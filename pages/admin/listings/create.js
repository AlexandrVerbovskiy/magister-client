import { useState } from "react";
import { adminSideProps } from "../../../middlewares";
import {
  createListingByAdmin,
  getAdminListingCreatePageOptions,
  updateListingByAdmin,
} from "../../../services";
import EditForm from "../../../components/admin/Listings/EditForm";
import { useRouter } from "next/router";

const ListingCreate = ({ categories }) => {
  const [listing, setListing] = useState({});
  const router = useRouter();

  const save = async (formData, authToken) => {
    if (listing.id) {
      formData.append("id", listing.id);
      const res = await updateListingByAdmin(formData, authToken);
      setListing(res);
      return res;
    } else {
      const res = await createListingByAdmin(formData, authToken);
      const id = res.id;
      const newLinkPart = window.location.origin + "/admin/listings/edit/" + id;
      router.replace(newLinkPart, undefined, { shallow: true });
      setListing(res);
      return res;
    }
  };

  return <EditForm categories={categories} listing={listing} save={save} />;
};

const boostServerSideProps = async ({ context, baseSideProps }) => {
  const options = await getAdminListingCreatePageOptions(
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  adminSideProps(context, boostServerSideProps);

export default ListingCreate;
