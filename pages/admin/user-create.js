import { useRouter } from "next/router";
import EditUserForm from "../../components/admin/EditUserForm";
import { createUser } from "../../services";

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

UserCreate.getInitialProps = async () => ({
  access: "admin",
  type: "admin",
});

export default UserCreate;
