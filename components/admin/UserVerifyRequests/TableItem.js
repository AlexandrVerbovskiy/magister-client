import Link from "next/link";
import View from "../FastActions/View";
import TableDateView from "../../admin/TableDateView";
import { useContext, useState } from "react";
import ShowMore from "../FastActions/ShowMore";
import SubInfoRow from "../SubInfoRow";
import { IndiceContext } from "../../../contexts";
import { getFilePath } from "../../../utils";

const TableItem = ({
  id,
  documents,
  userName,
  userEmail,
  userPhone,
  userPhoto,
  hasResponse,
  userId,
  createdAt,
  failedDescription,
  userPlaceWork,
  userContactDetails,
  userTwitterUrl,
  userFacebookUrl,
  userLinkedinUrl,
  userInstagramUrl,
  openPopupImage,
  handleApproveClick,
  handleDeclineClick,
}) => {
  let verifiedSpanText = "Suspended";
  let verifiedSpanClass =
    "bg-gray-200 dark:bg-gray-400/30 text-gray-600 dark:text-gray-400";

  if (hasResponse) {
    verifiedSpanText = failedDescription ? "Rejected" : "Verified";
    verifiedSpanClass = failedDescription
      ? "bg-rose-100 dark:bg-rose-500/30 text-rose-500 dark:text-rose-400"
      : "bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400";
  }

  const { sessionUser } = useContext(IndiceContext);
  const [descriptionOpen, setDescriptionOpen] = useState(false);

  const fullPhotoPath = userPhoto
    ? getFilePath(userPhoto)
    : STATIC.DEFAULT_PHOTO_LINK;

  const canMoveToUser = sessionUser?.id != userId;

  let approvementPhoto = null;

  for (let i = 0; i < Object.keys(documents).length; i++) {
    const document = documents[Object.keys(documents)[i]];

    if (document) {
      approvementPhoto = document;
      break;
    }
  }

  const fullApprovementPhotoPath = approvementPhoto
    ? getFilePath(approvementPhoto)
    : STATIC.DEFAULT_PHOTO_LINK;

  return (
    <>
      <tr>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div className="font-medium text-sky-500">#{id}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div>
            <Link
              onClick={(e) => (canMoveToUser ? {} : e.preventDefault())}
              style={canMoveToUser ? {} : { cursor: "auto" }}
              href={`/admin/users/edit/${userId}`}
            >
              {userName}
            </Link>
          </div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div>
            <Link
              onClick={(e) => (canMoveToUser ? {} : e.preventDefault())}
              style={canMoveToUser ? {} : { cursor: "auto" }}
              href={`/admin/users/edit/${userId}`}
            >
              {userEmail}
            </Link>
          </div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div
            className={`text-xs inline-flex font-medium ${verifiedSpanClass} rounded-full text-center px-2.5 py-1 overflow-separate`}
          >
            {verifiedSpanText}
          </div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <TableDateView date={createdAt} />
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
        <td
          colSpan={6}
          className="whitespace-nowrap overflow-separate border-r align-top"
          style={{ height: "0" }}
        >
          <table className="w-full h-full table-fixed">
            <thead>
              <tr>
                <th style={{ width: "20%", padding: 0 }}></th>
                <th style={{ width: "20%", padding: 0 }}></th>
                <th style={{ width: "20%", padding: 0 }}></th>
                <th style={{ width: "20%", padding: 0 }}></th>
                <th style={{ width: "20%", padding: 0 }}></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate border-r align-top">
                  <div>
                    <div className="font-semibold flex items-center">
                      Details
                    </div>
                    <SubInfoRow label="Name" value={userName} />
                    <SubInfoRow label="Email" value={userEmail} />
                    <SubInfoRow
                      label="Phone"
                      value={userPhone && userPhone.length ? userPhone : "-"}
                    />
                  </div>
                </td>
                <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate border-r align-top">
                  <div>
                    <div className="font-semibold flex items-center">
                      Contact
                    </div>
                    <SubInfoRow
                      label="Details"
                      value={
                        userContactDetails && userContactDetails.length
                          ? userContactDetails
                          : "-"
                      }
                    />
                    <SubInfoRow
                      label="Facebook"
                      value={
                        userFacebookUrl && userFacebookUrl.length
                          ? userFacebookUrl
                          : "-"
                      }
                    />
                    <SubInfoRow
                      label="Instagram"
                      value={
                        userInstagramUrl && userInstagramUrl.length
                          ? userInstagramUrl
                          : "-"
                      }
                    />
                    <SubInfoRow
                      label="Linkedin"
                      value={
                        userLinkedinUrl && userLinkedinUrl.length
                          ? userLinkedinUrl
                          : "-"
                      }
                    />
                    <SubInfoRow
                      label="Twitter"
                      value={
                        userTwitterUrl && userTwitterUrl.length
                          ? userTwitterUrl
                          : "-"
                      }
                    />
                  </div>
                </td>
                <td className="px-2 py-3 whitespace-nowrap overflow-separate border-r align-top">
                  <div className="h-full">
                    <div className="font-semibold flex items-center">
                      Picture
                    </div>

                    <div
                      className="mt-2 p-1 outline-gray-200 outline-dashed"
                      style={{ width: "150px", height: "200px" }}
                    >
                      <div
                        className="image-box cursor-zoom-in"
                        onClick={() => openPopupImage(fullPhotoPath)}
                      >
                        <img
                          src={fullPhotoPath}
                          alt="image"
                          width="200px"
                          height="200px"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-2 py-3 whitespace-nowrap overflow-separate border-r align-top">
                  <div className="h-full">
                    <div className="font-semibold flex items-center">
                      Document Uploaded
                    </div>
                    <div
                      className="mt-2 p-1 outline-gray-200 outline-dashed"
                      style={{ width: "150px", height: "200px" }}
                    >
                      <div
                        className="image-box cursor-zoom-in"
                        onClick={() => openPopupImage(fullApprovementPhotoPath)}
                      >
                        <img
                          src={fullApprovementPhotoPath}
                          alt="image"
                          width="200px"
                          height="200px"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-2 last:pr-5 py-3 whitespace-nowrap overflow-separate">
                  <div className="flex text-left gap-2 flex-wrap">
                    {!hasResponse && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApproveClick(id);
                          }}
                          className="bg-emerald-100 hover:bg-emerald-200 flex items-center text-emerald-500 hover:text-emerald-600 rounded-full py-2 px-4"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeclineClick(id);
                          }}
                          className="bg-rose-100 hover:bg-rose-200  flex items-center text-rose-500 hover:text-rose-600 rounded-full py-2 px-4"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    <View href={`/admin/user-verify-requests/${id}`} />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </>
  );
};

export default TableItem;
