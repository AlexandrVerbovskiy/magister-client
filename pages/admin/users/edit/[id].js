import React, { useContext } from "react";
import { getFullUserById, updateUser } from "../../../../services";
import EditUserForm from "../../../../components/admin/EditUserForm";
import { adminSideProps } from "../../../../middlewares";
import { IndiceContext } from "../../../../contexts";

const UserEdit = ({ editableUser }) => {
  const { authToken } = useContext(IndiceContext);

  const handleSave = async (formData) => {
    formData.append("id", editableUser.id);
    return await updateUser(formData, authToken);
  };

  return (
    <EditUserForm
      user={editableUser}
      save={handleSave}
      currentTitle={editableUser.name}
    />
  );
};

const boostServerSideProps = async ({ context, baseSideProps }) => {
  const id = context.params.id;
  const editableUser = await getFullUserById(id, baseSideProps.authToken);
  const currentUser = baseSideProps.sessionUser;

  if (currentUser.id === editableUser.id) {
    throw new Error("Permission denied");
  }

  return { editableUser };
};

export const getServerSideProps = (context) =>
  adminSideProps(context, boostServerSideProps);

export default UserEdit;
