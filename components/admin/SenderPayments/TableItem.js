import Link from "next/link";
import TableDateView from "../TableDateView";
import {
  fullDateConverter,
  getFilePath,
  getPaymentNameByType,
  isPayedUsedPaypal,
  moneyFormatVisual,
} from "../../../utils";
import View from "../FastActions/View";
import Status from "./Status";
import { useState } from "react";
import ShowMore from "../FastActions/ShowMore";
import SubInfoRow from "../SubInfoRow";
import PaypalCheck from "../PaypalCheck";
import STATIC from "../../../static";
import TableUserLink from "../TableUserLink";

const TableItem = (props) => {
  const {
    id,
    payerId,
    payerName,
    payerEmail,
    payerPhone,
    payerPhoto,
    payedProof,
    money,
    createdAt,
    viewPath,
    type,
    adminApproved,
    waitingApproved,
    orderId,
    listingName,
    listingId,
    openPopupImage,
    openPopupPaypal,
    handleApproveClick,
    handleRejectClick,
    data,
  } = props;

  const [descriptionOpen, setDescriptionOpen] = useState(false);

  const proofPath = payedProof
    ? getFilePath(payedProof)
    : STATIC.DEFAULTS.PHOTO_LINK;

  return (
    <>
      <tr>
        <td
          className="first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate"
          style={{ paddingRight: "calc(1rem + 10px)", paddingLeft: "10px" }}
        >
          <Link
            href={`/admin${viewPath}/${id}/`}
            className="font-medium text-sky-500"
          >
            #{id}
          </Link>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <TableUserLink id={payerId} name={payerName} photo={payerPhoto} />
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          {getPaymentNameByType(type)}
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div className="font-medium text-green-600">
            {moneyFormatVisual(money)}
          </div>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <TableDateView date={createdAt} />
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
          <Status
            adminApproved={adminApproved}
            waitingApproved={waitingApproved}
          />
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
        <td colSpan={7} className="overflow-separate border-r align-top">
          <table className="w-full table-fixed">
            <thead>
              <tr>
                <th style={{ width: "calc(20%)", padding: 0 }}></th>
                <th style={{ width: "calc(20%)", padding: 0 }}></th>
                <th style={{ width: "calc(25%)", padding: 0 }}></th>
                <th style={{ width: "calc(20%)", padding: 0 }}></th>
                <th style={{ width: "calc(15%)", padding: 0 }}></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate border-r align-top">
                  <div>
                    <div className="font-semibold flex items-center">
                      Details
                    </div>
                    <SubInfoRow label="Name" value={payerName} />
                    <SubInfoRow label="Email" value={payerEmail} />
                    <SubInfoRow
                      label="Phone"
                      value={payerPhone && payerPhone.length ? payerPhone : "-"}
                    />
                  </div>
                </td>
                <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate border-r align-top">
                  <div className="font-semibold flex items-center">
                    Transaction Detail
                  </div>
                  <SubInfoRow label="Sender's Name" value={payerName} />
                  <SubInfoRow
                    label="Upload Date"
                    value={fullDateConverter(createdAt)}
                  />
                  <SubInfoRow label="Rental Id" value={orderId} />
                </td>
                <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate border-r align-top">
                  <div className="font-semibold flex items-center">Rent</div>
                  <SubInfoRow label="Item" value={listingName} />
                  <SubInfoRow label="Item Id" value={listingId} />
                </td>
                <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate border-r align-top">
                  <div className="font-semibold flex items-center">
                    Receipt Uploaded:
                  </div>

                  {isPayedUsedPaypal(type) && (
                    <div
                      className="mt-2 p-1 outline-gray-200 outline-dashed"
                      style={{ width: "150px" }}
                    >
                      <div
                        className="image-box cursor-zoom-in"
                        onClick={() =>
                          openPopupPaypal({
                            rentalPrice: money,
                            listingName: listingName,
                            listingId: listingId,
                            payerEmail: payerEmail,
                            payerName: payerName,
                            payerId: payerId,
                            data: data,
                          })
                        }
                      >
                        <PaypalCheck
                          rentalPrice={money}
                          listingName={listingName}
                          listingId={listingId}
                          payerEmail={payerEmail}
                          payerName={payerName}
                          payerId={payerId}
                          data={data}
                          sizeType="small-size"
                        />
                      </div>
                    </div>
                  )}

                  {type == STATIC.PAYMENT_TYPES.BANK_TRANSFER && (
                    <div
                      className="mt-2 p-1 outline-gray-200 outline-dashed"
                      style={{ width: "150px", height: "200px" }}
                    >
                      <div
                        className="image-box cursor-zoom-in"
                        onClick={() => openPopupImage(proofPath)}
                      >
                        <img
                          src={proofPath}
                          alt="image"
                          width="200px"
                          height="200px"
                        />
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
                  <div className="flex text-left gap-2 flex-wrap">
                    {waitingApproved && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApproveClick(orderId);
                          }}
                          className="bg-emerald-100 hover:bg-emerald-200 flex items-center text-emerald-500 hover:text-emerald-600 rounded-full py-2 px-4"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRejectClick(orderId);
                          }}
                          className="bg-rose-100 hover:bg-rose-200  flex items-center text-rose-500 hover:text-rose-600 rounded-full py-2 px-4"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    <View href={`/admin${viewPath}/${id}/`} />
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
