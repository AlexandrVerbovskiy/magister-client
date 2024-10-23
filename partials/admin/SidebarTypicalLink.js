import Link from "next/link";
import { useRouter } from "next/router";
import { isCurrentAdminPath } from "../../services/isCurrentPath";

const SidebarTypicalLink = ({ SVG, link = "", title }) => {
  const router = useRouter();
  const isCurrent = isCurrentAdminPath(router.asPath, link);

  return (
    <li
      className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
        isCurrent && "bg-teal-900"
      }`}
    >
      <Link
        href={`/admin/${link ? link + "/" : ""}`}
        className={`block text-slate-100 truncate transition duration-150 ${
          isCurrent ? "hover:text-slate-200" : "hover:text-teal-600"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <SVG current={isCurrent} />

            <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
              {title}
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default SidebarTypicalLink;
