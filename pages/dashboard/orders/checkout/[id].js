import { useContext, useState } from "react";
import ImagePopup from "../../../../components/_App/ImagePopup";
import Navbar from "../../../../components/_App/Navbar";
import PageBanner from "../../../../components/Common/PageBanner";
import ItemInfo from "../../../../components/Order/OrderApprovementParts/ItemInfo";
import { authSideProps } from "../../../../middlewares";
import { getOrderCheckoutInfo } from "../../../../services";
import {
  autoCalculateCurrentTotalPrice,
  moneyFormatVisual,
  dateConverter,
  renterGetsFeeCalculate,
} from "../../../../utils";
import PaymentSection from "../../../../components/_App/PaymentSection";
import { useRouter } from "next/router";
import { IndiceContext } from "../../../../contexts";
import Link from "next/link";
import RenterInfo from "../../../../components/Order/OrderApprovementParts/RenterInfo";

const Checkout = ({ order, renterBaseCommission, bankInfo, authToken }) => {
  const { sessionUser } = useContext(IndiceContext);
  const router = useRouter();
  const [currentOpenImg, setCurrentOpenImg] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const closeCurrentOpenImg = () => setCurrentOpenImg(null);

  const price = order.offerPrice;
  const totalFee = renterGetsFeeCalculate(price, renterBaseCommission);
  const totalPrice = price + totalFee;

  const onRenterPayed = () => {
    router.push(`/dashboard/orders/${order.id}?success=Payed successfully`);
  };

  return (
    <>
      <Navbar canShowSearch={false} needBetaAlert={false} />

      <PageBanner
        pageTitle="Checkout"
        pageName="Checkout"
        imgSrc="/images/checkout.png"
        dopLinks={[
          { link: "/dashboard", title: "Dashboard" },
          { link: "/dashboard/orders", title: "Orders" },
          {
            link: `/dashboard/orders/${order.id}`,
            title: "Order #" + order.id,
          },
        ]}
      />

      <div className="listings-area ptb-70">
        <div className="container">
          <div className="row m-0">
            <div className="listings-sidebar row m-0">
              <div className="col-12 col-lg-4">
                <div className="h-100 listings-widget listings_contact_details">
                  <h3>Task Details</h3>

                  <div>
                    <div style={{ marginTop: "20px", marginBottom: "20px" }}>
                      <div className="d-flex">
                        <div className="date-info date-info-view">
                          <div className="date-info-label">Duration</div>
                          <div className="date-info-value">
                            {dateConverter(order.offerStartTime)} -{" "}
                            {dateConverter(order.offerFinishTime)}
                          </div>
                        </div>

                        <div className="date-info date-info-view">
                          <div className="date-info-label">Price</div>
                          <div className="date-info-value">
                            {moneyFormatVisual(order.offerPrice)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="d-flex justify-content-between"
                      style={{ marginTop: "10px", marginBottom: "10px" }}
                    >
                      <div>Offer Price</div>
                      <div>{moneyFormatVisual(price)}</div>
                    </div>

                    <div
                      className="d-flex justify-content-between"
                      style={{ marginTop: "10px", marginBottom: "10px" }}
                    >
                      <div>Service Fee</div>
                      <div>{moneyFormatVisual(totalFee)}</div>
                    </div>
                  </div>

                  <ul>
                    <li className="d-flex justify-content-between px-0">
                      <div>Total:</div>{" "}
                      <div>{moneyFormatVisual(totalPrice)}</div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-12 mt-4 mt-lg-0 col-lg-4">
                <RenterInfo
                  data={{
                    userId: order.renterId,
                    userName: order.renterName,
                    userPhoto: order.renterPhoto,
                    userCountItems: +order.renterCountItems,
                    userCommentCount: order.renterCommentCount,
                    userAverageRating: order.renterAverageRating,
                  }}
                  countItemsType="completed"
                  title="Renter"
                  wrapperClassName="h-100"
                />
              </div>
              <div className="col-12 mt-4 mt-lg-0 col-lg-4">
                <ItemInfo
                  setCurrentOpenImg={setCurrentOpenImg}
                  listing={{
                    id: order.listingId,
                    name: order.listingName,
                    listingImages: order.listingImages,
                    ownerAverageRating: order.ownerAverageRating,
                    ownerCommentCount: order.ownerCommentCount,
                  }}
                  wrapperClassName="h-100"
                />
              </div>
            </div>
          </div>

          <div className="row m-0 mt-4">
            <div className="listings-sidebar row m-0">
              <div className="col-12">
                {!sessionUser?.verified && (
                  <div className="card">
                    <div className="card-body">
                      <div
                        className="d-flex align-items-center"
                        style={{ fontSize: "18px" }}
                      >
                        <i className="bx bx-x-circle icon-danger me-1"></i>
                        <b>
                          You need to finish the user verification to proceed.
                        </b>
                      </div>
                      <Link
                        className="default-btn mt-3"
                        href="/dashboard/documents-verification"
                      >
                        Go to verification
                      </Link>
                    </div>
                  </div>
                )}

                {!(order.renterVerified && order.renterPaypalId) && (
                  <div className="card">
                    <div className="card-body">
                      <div
                        className="d-flex align-items-center"
                        style={{ fontSize: "18px" }}
                      >
                        <i className="bx bx-x-circle icon-danger me-1"></i>
                        <b>
                          To make a payment, the renter must be verified and
                          confirm his PayPal account.
                        </b>
                      </div>
                      <Link
                        className="default-btn mt-3"
                        href={"/dashboard/chats/" + order.chatId}
                      >
                        Notify renter
                      </Link>
                    </div>
                  </div>
                )}

                {order.renterVerified &&
                  order.renterPaypalId &&
                  sessionUser?.verified && (
                    <PaymentSection
                      disabled={disabled}
                      setDisabled={setDisabled}
                      bankInfo={bankInfo}
                      authToken={authToken}
                      onRenterPayed={onRenterPayed}
                      orderId={order.id}
                      amount={autoCalculateCurrentTotalPrice({
                        price: order.offerPrice,
                        ownerFee: order.ownerFee,
                        renterFee: order.renterFee,
                        type: "owner",
                      })}
                    />
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ImagePopup
        photoUrl={currentOpenImg}
        open={!!currentOpenImg}
        close={closeCurrentOpenImg}
      />
    </>
  );
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const id = context.params.id;
  const options = await getOrderCheckoutInfo(id, baseSideProps.authToken);
  return { ...options, id, pageTitle: `Checkout #${id}` };
};

export const getServerSideProps = (context) =>
  authSideProps({
    context,
    callback: boostServerSideProps,
  });

export default Checkout;
