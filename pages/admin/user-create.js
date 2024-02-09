import { useRouter } from "next/router";
import EditUserForm from "../../components/admin/EditUserForm";
import { createUser } from "../../services";
import { adminSideProps } from "../../middlewares";

const UserCreate = () => {
  const router = useRouter();

  const handleSave = async (formData) => {
    const user = await createUser(formData);
    const id = user.id;
    router.push("/admin/user-edit/" + id);
    return {};
  };

  return <EditUserForm user={{}} save={handleSave} currentTitle="New User" />;
};

export const getServerSideProps = adminSideProps;

export default UserCreate;
