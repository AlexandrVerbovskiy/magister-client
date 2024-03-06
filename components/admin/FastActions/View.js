import Link from "next/link";

const View = ({ href }) => {
  return (
    <Link
      href={href}
      className="flex text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 stroke-current"
        strokeWidth="1.5"
        stroke="#2c3e50"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 32 32"
      >
        <path
          stroke="none"
          d="M0 0h24v24H0z"
          fill="none"
          transform="translate(5, 5)"
        />
        <path
          d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"
          transform="translate(5, 5)"
        />
        <path
          d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"
          transform="translate(5, 5)"
        />
      </svg>
    </Link>
  );
};

export default View;
