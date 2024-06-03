import Link from "next/link";
import TableDateView from "../TableDateView";
import { fullTimeConverter, getFilePath, moneyFormat } from "../../../utils";
import View from "../FastActions/View";
import Status from "./Status";
import { useContext, useState } from "react";
import ShowMore from "../FastActions/ShowMore";
import SubInfoRow from "../SubInfoRow";
import { IndiceContext } from "../../../contexts";
import PaypalCheck from "../PaypalCheck";
import STATIC from "../../../static";

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
  } = props;

  const [descriptionOpen, setDescriptionOpen] = useState(false);

  const fullPayerPhotoPath = payerPhoto
    ? getFilePath(payerPhoto)
    : STATIC.DEFAULT_PHOTO_LINK;

  const proofPath = payedProof
    ? getFilePath(payedProof)
    : STATIC.DEFAULT_PHOTO_LINK;

  const { sessionUser } = useContext(IndiceContext);

  const canMoveToUser = sessionUser.id != payerId;

  return (
    <>
      <tr>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <Link
            href={`/admin/users/edit/${payerId}`}
            className="flex items-center"
            onClick={(e) => (canMoveToUser ? {} : e.preventDefault())}
            style={canMoveToUser ? {} : { cursor: "auto" }}
          >
            <img
              className="w-8 h-8 rounded-full mr-1"
              src={fullPayerPhotoPath}
              width="32"
              height="32"
              alt="Payer"
            />
            {payerName}
          </Link>
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          {type == "paypal" ? "Paypal" : "Bank Transfer"}
        </td>
        <td
          className="first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate text-center"
          style={{ paddingRight: "calc(1rem + 10px)", paddingLeft: "10px" }}
        >
          <Link
            href={`/admin${viewPath}/${id}`}
            className="font-medium text-sky-500"
          >
            #{id}
          </Link>
        </td>
        <td
          className="first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate text-center"
          style={{ paddingRight: "calc(1rem + 10px)", paddingLeft: "10px" }}
        >
          0
        </td>
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate">
          <div className="font-medium text-green-600">
            ${moneyFormat(money)}
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
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate border-r align-top">
          <div>
            <div className="font-semibold flex items-center">Details</div>
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
            value={fullTimeConverter(createdAt)}
          />
          <SubInfoRow label="Rental Id" value={orderId} />
        </td>
        <td
          colSpan={4}
          className="whitespace-nowrap overflow-separate border-r align-top p-0"
        >
          <table className="w-full table-fixed">
            <thead>
              <tr>
                <th style={{ width: "50%", padding: 0 }}></th>
                <th style={{ width: "50%", padding: 0 }}></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{ overflow: "hidden" }}
                  className="px-2 py-3 overflow-separate border-r align-top"
                >
                  <div className="font-semibold flex items-center">Rent</div>
                  <SubInfoRow label="Item" value={listingName} />
                  <SubInfoRow label="Item Id" value={listingId} />
                </td>
                <td
                  style={{ overflow: "hidden" }}
                  className="px-2 py-3 overflow-separate align-top"
                >
                  <div className="font-semibold flex items-center">
                    Receipt Uploaded:
                  </div>

                  {type == "paypal" && (
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
                          sizeType="small-size"
                        />
                      </div>
                    </div>
                  )}
                  {type != "paypal" && (
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
              </tr>
            </tbody>
          </table>
        </td>

        <td
          colSpan={2}
          className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap overflow-separate"
        >
          <div className="w-max">
            <View href={`/admin${viewPath}/${id}`} />
          </div>
        </td>
      </tr>
    </>
  );
};

export default TableItem;
