import Link from "next/link";
import { getFilePath } from "../../../utils";
import LinkIcon from "../Icons/LinkIcon";
import ActiveSpan from "../Disputes/ActiveSpan";

const Header = ({ users, dispute }) => {
  return (
    <div className="sticky top-16">
      <div className="flex items-center justify-between bg-white border-b border-slate-200 px-4 sm:px-6 md:px-5 h-10">
        <div className="flex items-center w-full">
          <div className="flex -space-x-3 -ml-px justify-between w-full">
            <Link
              href={"/admin/disputes/" + dispute.id}
              className="font-semibold flex items-center"
              style={{ color: "var(--mainColor)" }}
            >
              Issus #{dispute.id}
              <LinkIcon color="var(--mainColor)" />
            </Link>

            <ActiveSpan status={dispute.status} needToolTip={false} />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between bg-slate-50 border-b border-slate-200 px-4 sm:px-6 md:px-5 h-10">
        <div className="flex items-center">
          <div className="flex -space-x-3 -ml-px">
            {users.map((user) => (
              <a className="block" href={"/admin/users/edit/" + user.id}>
                <img
                  className="rounded-full border-2 border-white dark:border-slate-800 box-content"
                  src={getFilePath(user.photo)}
                  width="32"
                  height="32"
                  alt="User 04"
                />

                <div class="truncate">
                  <span class="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {user.name}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
