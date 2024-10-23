import View from "../FastActions/View";
import { moneyFormatVisual } from "../../../utils";
import { IndiceContext } from "../../../contexts";
import { useContext, useState } from "react";
import ShowMore from "../FastActions/ShowMore";
import SubInfoRow from "../SubInfoRow";
import SubInfoTitle from "../SubInfoTitle";
import TableDateView from "../TableDateView";
import STATIC from "../../../static";
import TableUserLink from "../TableUserLink";
import StatusSpan from "./StatusSpan";

const TypeSpan = ({ type }) => {
  let dopClass =
    "bg-emerald-100 dark:bg-emerald-400/30 text-emerald-600 dark:text-emerald-400";
  let text = "Rental";

  if (type == STATIC.RECIPIENT_PAYMENT_TYPES.REFUND) {
    dopClass =
      "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400";
    text = "Refund";
  }

  return (
    <div
      className={`text-xs inline-flex font-medium ${dopClass} rounded-full text-center px-2.5 py-1 overflow-separate`}
    >
      {text}
    </div>
  );
};

const TableItem = ({
  id,
  workerId,
  workerName,
  workerEmail,
  workerPhone,
  workerPhoto,
  money,
  status,
  receivedType,
  plannedTime,
  recipientId,
  recipientName,
  recipientEmail,
  recipientPhone,
  recipientPhoto,
  recipientPaypalId,
  viewPath,
  listingId,
  listingName,
  listingAddress,
  listingCity,
  listingPricePerDay,
  handleApproveClick,
  createdAt,
  type,
  data,
}) => {
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const { sessionUser, isAdmin } = useContext(IndiceContext);
  const canMoveToRecipient = isAdmin && sessionUser?.id != recipientId;

  return (
    <>
      <tr>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div className="font-medium text-sky-500">#{id}</div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <TableUserLink id={workerId} name={workerName} photo={workerPhoto} />
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <TableUserLink
            id={recipientId}
            name={recipientName}
            photo={recipientPhoto}
          />
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div className="font-medium text-green-600">
            {moneyFormatVisual(money)}
          </div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <TypeSpan type={receivedType} />
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <TableDateView date={createdAt} />
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <StatusSpan status={status} />
        </td>
        <td>
          <div className="flex text-left">
            <ShowMore
              showMoreClick={() => setDescriptionOpen(!descriptionOpen)}
              showMore={descriptionOpen}
              ariaControls={`order-${id}`}
            />
          </div>
        </td>
      </tr>

      <tr
        id={`order-${id}`}
        role="region"
        className={`${
          !descriptionOpen && "hidden"
        }  bg-slate-50 dark:bg-slate-900/30 dark:text-slate-400`}
      >
        <td colSpan={6} className="overflow-separate border-r align-top">
          <table className="w-full table-fixed">
            <thead>
              <tr>
                <th style={{ width: "calc(100% / 3)", padding: 0 }}></th>
                <th style={{ width: "calc(100% / 3)", padding: 0 }}></th>
                <th style={{ width: "calc(100% / 3)", padding: 0 }}></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{ overflow: "hidden" }}
                  className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate border-r align-top"
                >
                  <SubInfoTitle
                    title="Worker"
                    href={`/admin/users/edit/${workerId}`}
                    canMove={canMoveToRecipient}
                  />
                  <SubInfoRow label="Name" value={workerName} />
                  <SubInfoRow label="Email" value={workerEmail} />
                  <SubInfoRow
                    label="Phone"
                    value={
                      workerPhone && workerPhone.length ? workerPhone : "-"
                    }
                  />
                </td>
                <td
                  style={{ overflow: "hidden" }}
                  className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate border-r align-top"
                >
                  <SubInfoTitle
                    title="Recipient"
                    href={`/admin/users/edit/${recipientId}`}
                    canMove={canMoveToRecipient}
                  />
                  <SubInfoRow label="Name" value={recipientName} />
                  <SubInfoRow label="Email" value={recipientEmail} />
                  <SubInfoRow
                    label="Phone"
                    value={
                      recipientPhone && recipientPhone.length
                        ? recipientPhone
                        : "-"
                    }
                  />
                  {type == STATIC.PAYMENT_TYPES.BANK_TRANSFER && (
                    <>
                      <SubInfoRow label="Recipient Type" value="Credit Card" />
                      <SubInfoRow label="Card Number" value={data.cardNumber} />
                    </>
                  )}
                  {type == STATIC.PAYMENT_TYPES.PAYPAL && (
                    <>
                      <SubInfoRow label="Recipient Type" value="Paypal" />
                      {data?.paypalId ? (
                        <SubInfoRow
                          label="Payment Paypal Id"
                          value={data.paypalId}
                        />
                      ) : (
                        <SubInfoRow
                          label="Recipient Paypal Id"
                          value={recipientPaypalId}
                        />
                      )}
                    </>
                  )}
                </td>
                <td
                  style={{ overflow: "hidden" }}
                  className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate align-top"
                >
                  <SubInfoTitle
                    title="Item Details"
                    href={`/admin/listings/edit/${listingId}`}
                  />
                  <SubInfoRow label="Name" value={listingName} />
                  <SubInfoRow label="Address" value={listingAddress} />
                  <SubInfoRow label="City" value={listingCity} />
                  <SubInfoRow
                    label="Price"
                    value={listingPricePerDay}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </td>
        <td
          colSpan={2}
          className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate"
        >
          <div className="flex text-left gap-2 flex-wrap">
            {status != "completed" && (
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
            )}

            <View href={`/admin${viewPath}/${id}/`} />
          </div>
        </td>
      </tr>
    </>
  );
};

export default TableItem;
