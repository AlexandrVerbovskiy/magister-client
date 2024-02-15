import { useRouter } from "next/router";
import EditUserForm from "../../components/admin/EditUserForm";
import { createUser } from "../../services";
import { adminSideProps } from "../../middlewares";
import { useContext } from "react";
import { IndiceContext } from "../../contexts";

const UserCreate = () => {
  const router = useRouter();
  const { authToken } = useContext(IndiceContext);

  const handleSave = async (formData) => {
    const user = await createUser(formData, authToken);
    const id = user.id;
    router.push("/admin/user-edit/" + id);
    return {};
  };

  return <EditUserForm user={{}} save={handleSave} currentTitle="New User" />;
};

export const getServerSideProps = adminSideProps;

export default UserCreate;
