import Link from "next/link";

const Moderate = ({ href }) => {
  return (
    <Link
      href={href}
      className="flex items-center text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 stroke-current"
        strokeWidth="1.5"
        stroke="#2c3e50"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M7 10h3v-3l-3.5 -3.5a6 6 0 0 1 8 8l6 6a2 2 0 0 1 -3 3l-6 -6a6 6 0 0 1 -8 -8l3.5 3.5" />
      </svg>
    </Link>
  );
};

export default Moderate;
