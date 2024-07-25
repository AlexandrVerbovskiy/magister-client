import Link from "next/link";
import LinkIcon from "./Icons/LinkIcon";

const SubInfoTitle = ({ title, href, canMove = true }) => {
  if (canMove) {
    return (
      <Link href={href} className="font-semibold flex items-center">
        {title}
        <LinkIcon />
      </Link>
    );
  }

  return (
    <span className="font-semibold flex items-center">
      {title}
      <LinkIcon />
    </span>
  );
};

export default SubInfoTitle;
