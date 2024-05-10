import { useContext, useState } from "react";
import { adminSideProps } from "../../../middlewares";
import {
  createListingByAdmin,
  getAdminListingCreatePageOptions,
  updateListingByAdmin,
} from "../../../services";
import EditForm from "../../../components/admin/Listings/EditForm";
import { useRouter } from "next/router";
import { IndiceContext } from "../../../contexts";

const ListingCreate = ({ categories, defects }) => {
  const { error, sessionUser } = useContext(IndiceContext);
  const [listing, setListing] = useState({});
  const router = useRouter();

  const save = async (formData, authToken) => {
    if (!sessionUser?.paypalId) {
      error.set(
        "You cannot create listing if your profile do not have a linked card for payment"
      );
    }

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
  const options = await getAdminListingCreatePageOptions(
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  adminSideProps(context, boostServerSideProps);

export default ListingCreate;
