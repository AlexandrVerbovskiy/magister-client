import Link from "next/link";

const View = ({ href }) => {
  return (
    <Link
      href={href}
      className="bg-indigo-100 hover:bg-indigo-200  flex items-center text-indigo-500 hover:text-indigo-600 rounded-full py-2 px-4"
    >
      View
    </Link>
  );
};

export default View;
