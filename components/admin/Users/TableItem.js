import React, { useContext, useEffect, useState } from "react";
import { IndiceContext } from "../../../contexts";
import Tooltip from "../../../components/admin/Tooltip";
import Link from "next/link";

const ActiveSpan = ({ active, onClick, clickable = true }) => {
  const text = active ? "YES" : "NO";
  let dopClass = active
    ? "bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400"
    : "bg-rose-100 dark:bg-rose-500/30 text-rose-500 dark:text-rose-400";

  if (clickable) dopClass += " cursor-pointer";

  return (
    <div
      onClick={onClick}
      className={`text-xs inline-flex font-medium ${dopClass} rounded-full text-center px-2.5 py-1`}
    >
      {text}
    </div>
  );
};

const RoleSpan = ({ role, onClick = () => {} }) => {
  let dopClassName =
    "bg-sky-100 dark:bg-sky-500/30 text-sky-600 dark:text-sky-400";
  let text = "User";

  if (role == "admin") {
    dopClassName =
      "bg-amber-100 dark:bg-amber-400/30 text-amber-600 dark:text-amber-400";
    text = "Admin";
  }

  if (role == "support") {
    dopClassName =
      "bg-rose-100 dark:bg-rose-500/30 text-rose-500 dark:text-rose-400";
    text = "Support";
  }

  return (
    <div
      className={`text-xs inline-flex font-medium  rounded-full text-center px-2.5 py-1 ${dopClassName}`}
      onClick={() => onClick(role)}
    >
      {text}
    </div>
  );
};

const EmailSpan = ({ email, verified }) => {
  let className = "text-left cursor-pointer";
  let tooltipText = "";

  if (verified) {
    className += " text-emerald-500";
    tooltipText = "The user's email is verified";
  } else {
    className += " text-rose-500";
    tooltipText = "The user's email has not been verified";
  }

  return (
    <Tooltip title={tooltipText}>
      <div className={className}>{email}</div>
    </Tooltip>
  );
};

const PhoneSpan = ({ phone, verified }) => {
  if (!phone) {
    return <div className="text-left">-</div>;
  }

  let className = "text-left cursor-pointer";
  let tooltipText = "";

  if (phone) {
    if (verified) {
      className += " text-emerald-500";
      tooltipText = "The user's phone is verified";
    } else {
      className += " text-rose-500";
      tooltipText = "The user's phone has not been verified";
    }
  }

  return (
    <Tooltip title={tooltipText}>
      <div className={className}>{phone}</div>
    </Tooltip>
  );
};

const TableItem = ({
  id,
  name,
  emailVerified,
  phoneVerified,
  email,
  phone,
  active,
  verified,
  role,
  onDeleteClick,
  onChangeRole,
  onChangeActive,
  onChangeVerified,
}) => {
  const { user: currentUser, isAdmin } = useContext(IndiceContext);
  const [rolePopupActive, setRolePopupActive] = useState(false);

  const handleRoleClick = () => {
    if (isCurrent || role === "admin") return;
    setRolePopupActive(true);
  };

  const handleSelectRole = (value) => {
    if (value != role) {
      onChangeRole(value);
    }
    setRolePopupActive(false);
  };

  const closePopup = () => {
    setRolePopupActive(false);
  };

  const isCurrent = currentUser?.id == id;

  const handleChangeActive = () => {
    if (isCurrent || role === "admin") return;
    onChangeActive();
  };

  const handleChangeVerified = () => {
    if (isCurrent || role === "admin") return;
    onChangeVerified();
  };

  return (
    <tr>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-medium text-sky-500">#{id}</div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        {!isCurrent && role !== "admin" && isAdmin && (
          <Link href={`/admin/user-edit/${id}`}>
            <div className="text-left">{name}</div>
          </Link>
        )}

        {(isCurrent || role === "admin" || !isAdmin) && (
          <div className="text-left">{name}</div>
        )}
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <EmailSpan email={email} verified={emailVerified} />
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <PhoneSpan phone={phone} verified={phoneVerified} />
      </td>

      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">
          <ActiveSpan
            active={verified}
            onClick={handleChangeVerified}
            clickable={!isCurrent && role !== "admin"}
          />
        </div>
      </td>

      {isAdmin && (
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="text-left">
            <ActiveSpan
              active={active}
              onClick={handleChangeActive}
              clickable={!isCurrent && role !== "admin"}
            />
          </div>
        </td>
      )}

      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="text-left">
          {(isCurrent || !isAdmin || role === "admin") && (
            <span>
              <RoleSpan role={role} onClick={handleRoleClick} />
            </span>
          )}

          {!isCurrent && isAdmin && role !== "admin" && (
            <span className="cursor-pointer">
              <RoleSpan role={role} onClick={handleRoleClick} />
              <div
                className={`table-change-role-popup bg-white dark:bg-slate-800 shadow-lg rounded-sm px-2 ${
                  rolePopupActive ? "active" : ""
                }`}
              >
                <RoleSpan role="user" onClick={handleSelectRole} />
                <RoleSpan role="support" onClick={handleSelectRole} />
              </div>

              {rolePopupActive && (
                <div className="hidden-popup" onClick={closePopup}></div>
              )}
            </span>
          )}
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="flex text-left">
          {!isCurrent && role !== "admin" && (
            <div className="mr-1.5 flex items-center">
              <Link
                href={`/admin/user-documents/${id}`}
                className="flex text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-clipboard-text stroke-current"
                  width="24"
                  height="24"
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
            </div>
          )}

          {!isCurrent && role !== "admin" && isAdmin && (
            <div className="mr-1.5">
              <Link
                href={`/admin/user-edit/${id}`}
                className="flex text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 rounded-full"
              >
                <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                  <path d="M19.7 8.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM12.6 22H10v-2.6l6-6 2.6 2.6-6 6zm7.4-7.4L17.4 12l1.6-1.6 2.6 2.6-1.6 1.6z" />
                </svg>
              </Link>
            </div>
          )}

          {!isCurrent && role !== "admin" && isAdmin && (
            <button
              type="button"
              aria-controls="danger-modal"
              onClick={onDeleteClick}
              className="text-rose-500 hover:text-rose-600 rounded-full"
            >
              <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
                <path d="M13 15h2v6h-2zM17 15h2v6h-2z" />
                <path d="M20 9c0-.6-.4-1-1-1h-6c-.6 0-1 .4-1 1v2H8v2h1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V13h1v-2h-4V9zm-6 1h4v1h-4v-1zm7 3v9H11v-9h10z" />
              </svg>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default TableItem;
