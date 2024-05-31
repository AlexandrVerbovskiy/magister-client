import Link from "next/link";

const View = ({ href }) => {
  return (
    <Link
      href={href}
      className="bg-emerald-100 hover:bg-emerald-200 flex items-center text-emerald-400 hover:text-emerald-500 rounded-full py-2 px-4"
    >
      View
    </Link>
  );
};

export default View;
