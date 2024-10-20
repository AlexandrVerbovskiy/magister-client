import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { IndiceContext } from "../../contexts";
import NavbarThree from "../../components/_App/NavbarThree";
import DashboardNavbar from "../../components/Dashboard/DashboardNavbar";
import { authSideProps } from "../../middlewares";
import { getDashboardPageOptions, getDashboardOptions } from "../../services";
import DashboardLineChart from "../../components/Charts/DashboardLineChart";
import { baseTimeTypePageParams } from "../../utils";
import { useRouter } from "next/router";
import TransactionAnalyticsTable from "../../components/Charts/TransactionAnalyticsTable";
import DashboardDoughnutChart from "../../components/Charts/DashboardDoughnutChart";
import STATIC from "../../static";
import { useIsMobile } from "../../hooks";

const Sort = ({ handleChangeFilterDuration, durationFilter }) => {
  return (
    <select
      id="duration-filter"
      className="shop-select cursor-pointer"
      value={durationFilter}
      onChange={(e) => handleChangeFilterDuration(e.target.value)}
    >
      {[
        { value: "last-year", title: "Last Year" },
        { value: "last-month", title: "Last Month" },
        { value: "last-week", title: "Last Week" },
        { value: "last-day", title: "Last Day" },
      ].map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="cursor-pointer"
        >
          {option.title}
        </option>
      ))}
    </select>
  );
};

const Dashboard = (props) => {
  const router = useRouter();
  const { sessionUser, authToken, error } = useContext(IndiceContext);
  const [durationFilter, setDurationFilter] = useState("last-month");
  const [disabled, setDisabled] = useState(false);

  const [statistic, setStatistic] = useState({
    transactionsDetailInfo: props.transactionsDetailInfo,
    transactionDatesCount: props.transactionDatesCount,
    transactionDatesSum: props.transactionDatesSum,
    disputeTotalDatesCount: props.disputeTotalDatesCount,
    disputeStatisticInfo: props.disputeStatisticInfo,
  });

  const handleChangeFilterDuration = async (duration) => {
    if (disabled) {
      return;
    }

    try {
      setDisabled(true);
      setDurationFilter(duration);

      const data = await getDashboardOptions(
        {
          clientTime: Date.now(),
          timeFilterType: duration,
        },
        authToken
      );

      const currentLink = window.location.href;

      const newLinkPart =
        window.location.origin +
        window.location.pathname +
        (duration != "last-month" ? `?time-filter-type=${duration}` : "");

      if (currentLink !== newLinkPart) {
        router.replace(newLinkPart, undefined, { shallow: true });
      }

      setStatistic(data);
    } catch (e) {
      error.set(e.message);
    } finally {
      setDisabled(false);
    }
  };

  let timeType = "days";

  if (durationFilter == "last-day") {
    timeType = "hours";
  }

  if (durationFilter == "last-year") {
    timeType = "months";
  }

  const isMobile = useIsMobile();

  return (
    <>
      <DashboardNavbar />

      <div className="main-content d-flex flex-column">
        <NavbarThree>
          {isMobile && (
            <div
              className="pt-1 mt-2"
              style={{ borderTop: "1px solid #ede7f6" }}
            >
              <label className="search-header-section w-full d-block mt-2 mb-2">
                Sort By:{" "}
                <Sort
                  handleChangeFilterDuration={handleChangeFilterDuration}
                  durationFilter={durationFilter}
                />
              </label>
            </div>
          )}
        </NavbarThree>

        {!isMobile && (
          <div className="miran-grid-sorting row align-items-center">
            <div className="col-lg-6 col-md-6 result-count">
              <div className="breadcrumb-area">
                <h1>Dashboard</h1>
                <ol className="breadcrumb">
                  <li className="item">
                    <Link href="/">Home</Link>
                  </li>
                </ol>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 ordering">
              <div className="select-box">
                <label htmlFor="duration-filter">Sort By:</label>
                <Sort
                  handleChangeFilterDuration={handleChangeFilterDuration}
                  durationFilter={durationFilter}
                />
              </div>
            </div>
          </div>
        )}

        <div
          className="notification-alert alert alert-info alert-dismissible fade show"
          role="alert"
        >
          Welcome, <b>{sessionUser?.name}</b>!
        </div>

        <div className="row">
          <div className="col-12 col-sm-6">
            <DashboardLineChart
              title="Total transactions"
              data={[statistic.transactionDatesCount]}
              timeType={timeType}
            />
          </div>

          <div className="col-12 col-sm-6">
            <DashboardLineChart
              title="Amount of total transactions"
              data={[statistic.transactionDatesSum]}
              timeType={timeType}
              valueType="money"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <TransactionAnalyticsTable
              title={`Total amount (${STATIC.CURRENCY}) by type of payment`}
              data={statistic.transactionsDetailInfo}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-sm-6">
            <DashboardDoughnutChart
              title="Total Disputes"
              data={{
                "Active Disputes":
                  statistic.disputeStatisticInfo.allActiveDisputes,
                "Solved Disputes":
                  statistic.disputeStatisticInfo.allSolvedDisputes,
              }}
            />
          </div>

          <div className="col-12 col-sm-6">
            <DashboardLineChart
              title="Active Disputes"
              data={[statistic.disputeTotalDatesCount]}
              timeType={timeType}
              getTotalType="last"
              height={312}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const options = await getDashboardPageOptions(
    baseTimeTypePageParams(context.query),
    baseSideProps.authToken
  );
  return { ...options };
};

export const getServerSideProps = (context) =>
  authSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "Dashboard" },
  });

export default Dashboard;
