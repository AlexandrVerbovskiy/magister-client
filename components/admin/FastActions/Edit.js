import Link from "next/link";

const Edit = ({ href }) => {
  return (
    <Link
      href={href}
      className="flex items-center text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full"
    >
      <svg className="w-4 h-4 fill-current" viewBox="8 8 16 16">
        <path d="M19.7 8.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM12.6 22H10v-2.6l6-6 2.6 2.6-6 6zm7.4-7.4L17.4 12l1.6-1.6 2.6 2.6-1.6 1.6z" />
      </svg>
    </Link>
  );
};

export default Edit;
