import Link from "next/link";
import LinkIcon from "./Icons/LinkIcon";

const SubInfoTitle = ({ title, href, canMove = true }) => {
  return (
    <Link
      href={href}
      className="font-semibold flex items-center"
      onClick={(e) => (canMove ? {} : e.preventDefault())}
      style={canMove ? {} : { cursor: "auto" }}
    >
      {title}
      <LinkIcon />
    </Link>
  );
};

export default SubInfoTitle;
