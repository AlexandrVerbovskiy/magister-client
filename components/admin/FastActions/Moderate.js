import Link from "next/link";

const Moderate = ({ href }) => {
  return (
    <Link
      href={href}
      className="bg-slate-100 hover:bg-slate-300 text-slate-500 items-center hover:text-slate-600 rounded-full py-2 px-4"
    >
      Moderate
    </Link>
  );
};

export default Moderate;
