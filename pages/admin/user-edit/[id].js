import React from "react";
import { getFullUserById, updateUser } from "../../../services";
import EditUserForm from "../../../components/admin/EditUserForm";
import { adminSideProps } from "../../../middlewares";
import env from "../../../env"

const UserEdit = ({ editableUser }) => {
  const handleSave = async (formData) => {
    formData.append("id", editableUser.id);
    return await updateUser(formData);
  };

  return (
    <EditUserForm
      user={editableUser}
      save={handleSave}
      currentTitle={editableUser.name}
    />
  );
};

export const getServerSideProps = async (context) => {
  const baseSideProps = await adminSideProps(context);
  const id = context.params.id;
  
  if (baseSideProps.notFound || !id) {
    return {
      notFound: true,
    };
  }

  try {
    const authToken = context.req.cookies[env.AUTH_COOKIE_NAME] ?? null;
    const editableUser = await getFullUserById(id, authToken);

    const currentUser = baseSideProps.props.user;

    if (currentUser.id === editableUser.id) {
      throw new Error("Permission denied")
    }

    return {
      props: { ...baseSideProps.props, editableUser },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

export default UserEdit;
