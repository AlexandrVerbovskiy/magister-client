import { signOut } from "next-auth/react";
import YesNoModal from "./YesNoModal";
import { useContext } from "react";
import { IndiceContext } from "../../contexts";

const SignOutModal = ({ active, closeModal }) => {
  const { error } = useContext(IndiceContext);

  const onAccept = async () => {
    try {
      await signOut({ redirect: false });
      closeModal();
    } catch (e) {
      error.set(e.message);
    }
  };

  return (
    <YesNoModal
      title="Do you really want to sign out?"
      active={active}
      closeModal={closeModal}
      onAccept={onAccept}
      acceptText="Sign out"
      closeModalClassName="Cancel"
      acceptModalClassName="button-danger"
    />
  );
};

export default SignOutModal;
