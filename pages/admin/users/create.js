import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import EditUserForm from "../../../components/admin/EditUserForm";
import { createUser, updateUser } from "../../../services";
import { adminSideProps } from "../../../middlewares";
import { IndiceContext } from "../../../contexts";

const UserCreate = () => {
  const router = useRouter();
  const { authToken } = useContext(IndiceContext);
  const [userId, setUserId] = useState(null);

  const handleSave = async (formData) => {
    if (!userId) {
      const { user } = await createUser(formData, authToken);
      const id = user.id;
      setUserId(id);
      router.replace("/admin/users/edit/" + id, undefined, { shallow: true });
      return { user };
    } else {
      formData.append("id", editableUser.id);
      return await updateUser(formData, authToken);
    }
  };

  return <EditUserForm user={{}} save={handleSave} currentTitle="New User" />;
};

export const getServerSideProps = (context) =>
  adminSideProps({ context, baseProps: { pageTitle: "Create User" } });

export default UserCreate;
