import React, { useContext } from "react";
import { IndiceContext } from "../../../contexts";

const ActiveSpan = ({ active, onClick }) => {
  const text = active ? "YES" : "NO";
  const dopClass = active
    ? "bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400"
    : "bg-rose-100 dark:bg-rose-500/30 text-rose-500 dark:text-rose-400";

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer text-xs inline-flex font-medium ${dopClass} rounded-full text-center px-2.5 py-1`}
    >
      {text}
    </div>
  );
};

const RoleSpan = ({ role }) => {
  if (role == "admin")
    return (
      <div className="text-xs inline-flex font-medium bg-amber-100 dark:bg-amber-400/30 text-amber-600 dark:text-amber-400 rounded-full text-center px-2.5 py-1">
        Admin
      </div>
    );
  if (role == "support")
    return (
      <span className="text-xs inline-flex font-medium bg-rose-100 dark:bg-rose-500/30 text-rose-500 dark:text-rose-400 rounded-full text-center px-2.5 py-1">
        Support
      </span>
    );
  return (
    <span className="text-xs inline-flex font-medium bg-sky-100 dark:bg-sky-500/30 text-sky-600 dark:text-sky-400 rounded-full text-center px-2.5 py-1">
      User
    </span>
  );
};

const TableItem = ({
  id,
  name,
  email,
  phone,
  active,
  role,
  onDeleteClick,
  onChangeRole,
  onChangeActive,
}) => {
  const { user: currentUser } = useContext(IndiceContext);

  return (
    <tr>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">{id}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">{name}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">{email}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">{phone}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">
          <ActiveSpan active={active} onClick={onChangeActive} />
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">
          <RoleSpan role={role} />
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="flex text-left">
          <div className="mr-1.5">
            <a
              href={`/admin/user-edit/${id}`}
              className="btn dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
            >
              <svg
                className="w-4 h-4 fill-current text-slate-500 dark:text-slate-400 shrink-0"
                viewBox="0 0 16 16"
              >
                <path d="M11.7.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM4.6 14H2v-2.6l6-6L10.6 8l-6 6zM12 6.6L9.4 4 11 2.4 13.6 5 12 6.6z" />
              </svg>
            </a>
          </div>

          {currentUser.id != id && (
            <div>
              <button
                type="button"
                aria-controls="danger-modal"
                onClick={onDeleteClick}
                className="btn dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
              >
                <svg
                  className="w-4 h-4 fill-current text-rose-500 shrink-0"
                  viewBox="0 0 16 16"
                >
                  <path d="M5 7h2v6H5V7zm4 0h2v6H9V7zm3-6v2h4v2h-1v10c0 .6-.4 1-1 1H2c-.6 0-1-.4-1-1V5H0V3h4V1c0-.6.4-1 1-1h6c.6 0 1 .4 1 1zM6 2v1h4V2H6zm7 3H3v9h10V5z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default TableItem;
