import { useContext } from "react";
import { IndiceContext } from "../../contexts";
import Link from "next/link";
import { generateProfileFilePath } from "../../utils";

const MainPart = ({ needPhoto, photo, name }) => {
  return (
    <>
      {needPhoto && (
        <img
          className="w-8 h-8 rounded-full mr-1"
          src={generateProfileFilePath(photo)}
          width="32"
          height="32"
          alt="Payer"
        />
      )}
      {name}
    </>
  );
};

const TableUserLink = ({ id, name, photo = null, needPhoto = true }) => {
  const { sessionUser, isAdmin } = useContext(IndiceContext);
  const canMoveToUser = sessionUser?.id != id && isAdmin;

  if (canMoveToUser) {
    return (
      <Link href={`/admin/users/edit/${id}/`} className="flex items-center">
        <MainPart needPhoto={needPhoto} photo={photo} name={name} />
      </Link>
    );
  }

  return (
    <span className="flex items-center">
      <MainPart needPhoto={needPhoto} photo={photo} name={name} />
    </span>
  );
};

export default TableUserLink;
