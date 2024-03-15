import Link from "next/link";

const View = ({ href }) => {
  return (
    <Link
      href={href}
      className="flex items-center text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 stroke-current"
        viewBox="0 0 24 24"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
        <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
        <path d="M9 12h6" />
        <path d="M9 16h6" />
      </svg>
    </Link>
  );
};

export default View;
