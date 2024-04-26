import Link from "next/link";
import NavbarThree from "../../../components/_App/NavbarThree";
import DashboardNavbar from "../../../components/Dashboard/DashboardNavbar";
import { getOrderList, getOrderListOptions } from "../../../services";
import { baseTimeListPageParams } from "../../../utils";
import { IndiceContext } from "../../../contexts";
import { useContext, useState } from "react";
import { authSideProps } from "../../../middlewares";
import { useRouter } from "next/router";
import {
  useChangeTimeFilter,
  useInitPaginationTimeFilter,
  usePagination,
} from "../../../hooks";
import OrderItem from "../../../components/Listings/OrderItem";
import ListFilter from "../../../components/Order/ListFilter";
import Pagination from "../../../components/Pagination";

const TabHeaderSection = ({
  type,
  changeType,
  filter,
  changeFilter,
  countItems,
  style = {},
  handleChangeTimeFilter,
  fromTime,
  toTime,
}) => (
  <ul
    className="nav nav-tabs d-flex align-items-center justify-content-between"
    id="myTab"
    style={style}
  >
    <li className="nav-item">
      <a className="nav-link active" id="all-listing-tab">
        <span className="menu-title">All Bookings ({countItems})</span>
      </a>
    </li>

    <ListFilter
      type={type}
      changeType={changeType}
      filter={filter}
      changeFilter={changeFilter}
      handleChangeTimeFilter={handleChangeTimeFilter}
      fromTime={fromTime}
      toTime={toTime}
    />
  </ul>
);

const Orders = (pageProps) => {
  const router = useRouter();
  const { error, success, authToken } = useContext(IndiceContext);
  const [type, setType] = useState(router.query.type ?? "tenant");

  const { fromTime, setFromTime, toTime, setToTime, getTimeFilterProps } =
    useInitPaginationTimeFilter();

  const {
    page,
    countItems,
    countPages,
    moveToPage,
    filter,
    changeFilter,
    canMoveNextPage,
    canMovePrevPage,
    items: orders,
    rebuild,
    options,
    isFirstBookingCall,
  } = usePagination({
    getItemsFunc: (data) => getOrderList(data, authToken),
    onError: (e) => error.set(e.message),
    defaultData: pageProps,
    getDopProps: () => ({
      ...getTimeFilterProps(),
      type: {
        value: type,
        hidden: (value) => value == "tenant",
      },
    }),
  });

  const { handleChangeTimeFilter } = useChangeTimeFilter({
    options,
    fromTime,
    setFromTime,
    toTime,
    setToTime,
    rebuild,
  });

  const changeType = (value) => {
    setType(value);
    rebuild({ type: value });
  };

  return (
    <>
      <DashboardNavbar />

      <div className="main-content d-flex flex-column">
        <NavbarThree />

        <div className="header-section">
          <div className="breadcrumb-area">
            <h1>Orders</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link href="/">Home</Link>
              </li>
              <li className="item">
                <Link href="/settings/">Dashboard</Link>
              </li>
              <li className="item">Orders</li>
            </ol>
          </div>
        </div>

        {((!isFirstBookingCall && orders.length < 1) ||
          (isFirstBookingCall && pageProps.items.length < 1)) && (
          <section className="listing-area">
            <TabHeaderSection
              style={{ marginBottom: "0" }}
              filter={filter}
              changeFilter={changeFilter}
              countItems={countItems}
              type={type}
              changeType={changeType}
              handleChangeTimeFilter={handleChangeTimeFilter}
              fromTime={fromTime}
              toTime={toTime}
            />

            <div className="no-listing">
              <div className="no-listing-img"></div>
              <div className="no-listing-text">You have no orders yet</div>
            </div>
          </section>
        )}

        {orders.length > 0 && (
          <>
            <section className="listing-area">
              <TabHeaderSection
                filter={filter}
                changeFilter={changeFilter}
                countItems={countItems}
                type={type}
                changeType={changeType}
                handleChangeTimeFilter={handleChangeTimeFilter}
                fromTime={fromTime}
                toTime={toTime}
              />

              <div className="tab-content">
                <div className="tab-pane fade show active" id="all-listing">
                  <div
                    className="row"
                    style={{ alignItems: "stretch", gridRowGap: "20px" }}
                  >
                    {orders.map((order) => (
                      <OrderItem
                        key={order.id}
                        {...order}
                        link={`/settings/orders/${id}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <Pagination
              viewOnlyMoreOnePage={true}
              page={page}
              countPages={countPages}
              move={moveToPage}
              canNext={canMoveNextPage}
              canPrev={canMovePrevPage}
            />
          </>
        )}
      </div>
    </>
  );
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const type = context.query.type === "owner" ? "owner" : "tenant";
  const params = { ...baseTimeListPageParams(context.query), type };
  const options = await getOrderListOptions(params, baseSideProps.authToken);
  return { ...options };
};

export const getServerSideProps = (context) =>
  authSideProps(context, boostServerSideProps);

export default Orders;
