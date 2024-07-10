import { useContext } from "react";
import { IndiceContext } from "../../contexts";
import YesNoModal from "./YesNoModal";
import { signOut } from "next-auth/react";

const SignOutModal = ({ handleCloseModal, modalOpen }) => {
  const { error } = useContext(IndiceContext);

  const onAccept = async () => {
    try {
      await signOut({ redirect: false });
      handleCloseModal();
    } catch (e) {
      error.set(e.message);
    }
  };

  return (
    <YesNoModal
      handleCloseModal={handleCloseModal}
      onAccept={onAccept}
      modalOpen={modalOpen}
      title="Do you really want to sign out?"
      acceptText="Sign out"
      cancelText="Cancel"
    />
  );
};

export default SignOutModal;
