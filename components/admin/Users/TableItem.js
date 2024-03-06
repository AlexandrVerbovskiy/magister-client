import React, { useContext, useEffect, useState } from "react";
import { IndiceContext } from "../../../contexts";
import Tooltip from "../../../components/admin/Tooltip";
import Link from "next/link";
import Delete from "../FastActions/Delete";
import Edit from "../FastActions/Edit";
import Documents from "../FastActions/Documents";

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
            <div className="mr-1 flex items-center">
              <Documents href={`/admin/user-documents/${id}`} />
            </div>
          )}

          {!isCurrent && role !== "admin" && isAdmin && (
              <Edit href={`/admin/user-edit/${id}`} />
          )}

          {!isCurrent && role !== "admin" && isAdmin && (
            <Delete onDeleteClick={onDeleteClick} />
          )}
        </div>
      </td>
    </tr>
  );
};

export default TableItem;
