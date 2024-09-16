import React from "react";
import { getFullUserById, updateUser } from "../../../../services";
import EditUserForm from "../../../../components/admin/EditUserForm";
import { adminSideProps } from "../../../../middlewares";
import { HttpError } from "../../../../utils";
import { useIdPage } from "../../../../hooks";

const UserEdit = (baseProps) => {
  const { props, authToken } = useIdPage({
    baseProps,
    getPagePropsFunc: ({ field, authToken }) =>
      getFullUserById(field, authToken),
  });

  const { editableUser } = props;

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
    throw new HttpError(403, "Permission denied");
  }

  return { editableUser, pageTitle: editableUser?.name };
};

export const getServerSideProps = (context) =>
  adminSideProps({ context, callback: boostServerSideProps });

export default UserEdit;
