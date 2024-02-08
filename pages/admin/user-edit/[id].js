import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import ErrorPage from "next/error";
import { getFullUserById, updateUser } from "../../../services";
import EditUserForm from "../../../components/admin/EditUserForm";
import { IndiceContext } from "../../../contexts";

const UserEdit = () => {
  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = useState(null);
  const { error } = useContext(IndiceContext);

  const initUser = async () => {
    try {
      if (id) {
        const gotUserInfo = await getFullUserById(id);
        setUser(gotUserInfo);
      } else {
        setUser(null);
      }
    } catch (e) {
      error.set(e.message);
    }
  };

  useEffect(() => {
    initUser();
  }, [id]);

  if (!user) {
    return <ErrorPage statusCode={404} />;
  }

  const handleSave = async (formData) => {
    formData.append("id", id);
    return await updateUser(formData);
  };

  return (
    <EditUserForm
      user={user}
      save={handleSave}
      currentTitle={user ? user.name : "New User"}
    />
  );
};

UserEdit.getInitialProps = async () => ({
  access: "admin",
  type: "admin",
});

export default UserEdit;
