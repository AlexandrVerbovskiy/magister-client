import Link from "next/link";

const Edit = ({ href }) => {
  return (
    <Link
      href={href}
      className="bg-emerald-100 hover:bg-emerald-200 text-emerald-500 items-center hover:text-emerald-600 rounded-full py-2 px-4"
    >
      Edit
    </Link>
  );
};

export default Edit;
