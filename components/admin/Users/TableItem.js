import React, { useContext, useEffect, useState } from "react";
import { IndiceContext } from "../../../contexts";
import Tooltip from "../../../components/admin/Tooltip";
import Link from "next/link";
import Delete from "../FastActions/Delete";
import Edit from "../FastActions/Edit";
import Documents from "../FastActions/Documents";
import ShowMore from "../FastActions/ShowMore";
import STATIC from "../../../static";
import TableDateView from "../TableDateView";
import {
  generateProfileFilePath,
  getFilePath,
  moneyFormat,
  dateConverter,
} from "../../../utils";
import SubInfoRow from "../SubInfoRow";
import SubInfoRowWithChild from "../SubInfoRowWithChild";
import SingleRatingStar from "../SingleRatingStar";

const ActiveSpan = ({ active, onClick, clickable = true }) => {
  const text = active ? "Active" : "Suspended";
  let dopClass = active
    ? "bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400"
    : "bg-rose-100 dark:bg-rose-500/30 text-rose-500 dark:text-rose-400";

  if (clickable) dopClass += " cursor-pointer";

  return (
    <div
      onClick={onClick}
      className={`text-xs inline-flex font-medium ${dopClass} rounded-full text-center px-2.5 py-1 overflow-separate`}
    >
      {text}
    </div>
  );
};

const RoleSpan = ({ role, onClick = () => {} }) => {
  let dopClassName =
    "bg-sky-100 dark:bg-sky-500/30 text-sky-600 dark:text-sky-400 overflow-separate";
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
  let className = "text-left overflow-separate overflow-separate";
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

const TableItem = ({
  id,
  name,
  emailVerified,
  phoneVerified,
  email,
  phone,
  photo,
  active,
  verified,
  onDeleteClick,
  onChangeRole,
  onChangeActive,
  onChangeVerified,
  createdAt,
  role,
  totalRents,
  totalSpent,
  briefBio,
  lastRenterDate,
  contactDetails,
  facebookUrl,
  instagramUrl,
  linkedinUrl,
  twitterUrl,
  ownerAverageRating,
  tenantAverageRating,
  ownerCommentCount,
  tenantCommentCount,
  tenantDisputesCount,
  ownerDisputesCount,
}) => {
  const { sessionUser, isAdmin } = useContext(IndiceContext);
  const [rolePopupActive, setRolePopupActive] = useState(false);
  const [descriptionOpen, setDescriptionOpen] = useState(false);

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

  const isCurrent = sessionUser?.id == id;

  const handleChangeActive = () => {
    if (isCurrent || role === "admin") return;
    onChangeActive();
  };

  const handleChangeVerified = () => {
    if (isCurrent || role === "admin") return;
    onChangeVerified();
  };

  const fullPhotoPath = generateProfileFilePath(photo);

  const canMoveToUser = sessionUser?.id != id && isAdmin;

  return (
    <>
      <tr>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <Link
            href={`/admin/users/edit/${id}/`}
            className="flex items-center"
            onClick={(e) => (canMoveToUser ? {} : e.preventDefault())}
            style={canMoveToUser ? {} : { cursor: "auto" }}
          >
            <img
              className="w-8 h-8 rounded-full mr-1"
              src={fullPhotoPath}
              width="32"
              height="32"
              alt="Payer"
            />
            {name}
          </Link>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <EmailSpan email={email} verified={emailVerified} />
        </td>

        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <TableDateView date={createdAt} />
        </td>

        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          {totalRents}
        </td>

        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <div className="font-medium text-green-600">
            ${moneyFormat(totalSpent ?? 0)}
          </div>
        </td>

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
          <div className="text-left">
            <ActiveSpan
              active={active}
              onClick={handleChangeActive}
              clickable={!isCurrent && role !== "admin"}
            />
          </div>
        </td>

        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div className="flex text-left">
            <ShowMore
              showMoreClick={() => setDescriptionOpen(!descriptionOpen)}
              showMore={descriptionOpen}
              ariaControls={`user-${id}`}
            />
          </div>
        </td>
      </tr>
      <tr
        id={`user-${id}`}
        role="region"
        className={`${
          !descriptionOpen && "hidden"
        }  bg-slate-50 dark:bg-slate-900/30 dark:text-slate-400`}
      >
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate border-r align-top">
          <div>
            <div className="font-semibold flex items-center">Details</div>
            <SubInfoRow label="Name" value={name} />
            <SubInfoRow label="Email" value={email} />
            <SubInfoRow
              label="Phone"
              value={phone && phone.length ? phone : "-"}
            />
          </div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate border-r align-top">
          <div style={{ textWrap: "wrap" }}>
            <div className="font-semibold flex items-center">Biography</div>
            {briefBio && briefBio.length ? briefBio : "-"}
          </div>
        </td>
        <td
          colSpan={2}
          className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate border-r align-top"
        >
          <div>
            <div className="font-semibold flex items-center">Contact</div>
            <SubInfoRow
              label="Details"
              value={
                contactDetails && contactDetails.length ? contactDetails : "-"
              }
            />
            <SubInfoRow
              label="Facebook"
              value={facebookUrl && facebookUrl.length ? facebookUrl : "-"}
            />
            <SubInfoRow
              label="Instagram"
              value={instagramUrl && instagramUrl.length ? instagramUrl : "-"}
            />
            <SubInfoRow
              label="Linkedin"
              value={linkedinUrl && linkedinUrl.length ? linkedinUrl : "-"}
            />
            <SubInfoRow
              label="Twitter"
              value={twitterUrl && twitterUrl.length ? twitterUrl : "-"}
            />
          </div>
        </td>
        <td colSpan={2}>
          <table>
            <thead>
              <tr>
                <th style={{ width: "60%" }}></th>
                <th style={{ width: "40%" }}></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 py-3 whitespace-nowrap overflow-separate border-r align-top">
                  <div>
                    <div className="font-semibold flex items-center">
                      Activity
                    </div>
                    <SubInfoRow
                      label="Last rental"
                      value={
                        lastRenterDate ? dateConverter(lastRenterDate) : "-"
                      }
                      newRow={true}
                    />
                    <SubInfoRow
                      label="Renter Disputes"
                      value={tenantDisputesCount}
                      newRow={true}
                    />
                    <SubInfoRow
                      label="Owner Disputes"
                      value={ownerDisputesCount}
                      newRow={true}
                    />

                    <SubInfoRowWithChild label="Renter">
                      <SingleRatingStar
                        value={tenantAverageRating}
                        count={tenantCommentCount}
                        commentName="renter"
                      />
                    </SubInfoRowWithChild>
                    <SubInfoRowWithChild label="Owner">
                      <SingleRatingStar
                        value={ownerAverageRating}
                        count={ownerCommentCount}
                        commentName="owner"
                      />
                    </SubInfoRowWithChild>
                  </div>
                </td>
                <td className="px-2 py-3 border-r">
                  <ActiveSpan
                    active={verified}
                    onClick={handleChangeVerified}
                    clickable={!isCurrent && role !== "admin"}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </td>
        <td colSpan={2} className="px-2 first:pl-5 last:pr-5 py-3">
          <div className="flex items-center justify-start gap-2 flex-wrap">
            {!isCurrent && role !== "admin" && isAdmin && (
              <Edit href={`/admin/users/edit/${id}`} />
            )}
            {!isCurrent && role !== "admin" && (
              <Documents href={`/admin/users/documents/${id}/`} />
            )}
          </div>
        </td>
      </tr>
    </>
  );
};

export default TableItem;
