import Link from "next/link";

const View = ({ href }) => {
  return (
    <Link
      href={href}
      className="bg-teal-100 hover:bg-teal-200  flex items-center text-teal-500 hover:text-teal-600 rounded-full py-2 px-4"
    >
      View
    </Link>
  );
};

export default View;
