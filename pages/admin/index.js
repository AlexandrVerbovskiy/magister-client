import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../partials/admin/Sidebar";
import Header from "../../partials/admin/Header";
import { useAdminPage } from "../../hooks";
import { supportSideProps } from "../../middlewares";
import {
  getAdminDashboardPageOptions,
  getAdminDashboardOptions,
} from "../../services";
import BreadCrumbs from "../../partials/admin/base/BreadCrumbs";
import DateSelect from "../../components/admin/DateSelect";
import DashboardLineChart from "../../components/admin/Charts/DashboardLineChart";
import TransactionAnalyticsTable from "../../components/admin/Charts/TransactionAnalyticsTable";
import DashboardDoughnutChart from "../../components/admin/Charts/DashboardDoughnutChart";
import { IndiceContext } from "../../contexts";
import { baseTimeTypePageParams } from "../../utils";
import STATIC from "../../static";

const AdminIndex = (props) => {
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const [disabled, setDisabled] = useState(false);
  const { authToken, error } = useContext(IndiceContext);

  const [filterType, setFilterType] = useState(props.timeFilterType);

  const [statistic, setStatistic] = useState({
    userInactiveRegisterDatesCount: props.userInactiveRegisterDatesCount,
    userRegisterDatesCount: props.userRegisterDatesCount,
    transactionsDetailInfo: props.transactionsDetailInfo,
    transactionDatesCount: props.transactionDatesCount,
    transactionDatesSum: props.transactionDatesSum,
    userTotalDatesCount: props.userTotalDatesCount,
    totalNewInactiveUsers: 0,
    totalNewUsers: 0,
    disputeTotalDatesCount: props.disputeTotalDatesCount,
    disputeStatisticInfo: props.disputeStatisticInfo,
  });

  const calculableInfos = (
    userInactiveRegisterDatesCount,
    userRegisterDatesCount
  ) => {
    const newInactiveKeys = Object.keys(userInactiveRegisterDatesCount);
    const totalNewInactiveUsers =
      userInactiveRegisterDatesCount[
        newInactiveKeys[newInactiveKeys.length - 1]
      ];

    const newUserKeys = Object.keys(userRegisterDatesCount);
    const totalNewUsers =
      userRegisterDatesCount[newUserKeys[newUserKeys.length - 1]];

    return { totalNewInactiveUsers, totalNewUsers };
  };

  const handleChangeFilterType = async (value) => {
    if (disabled) {
      return;
    }

    try {
      setFilterType(value);
      setDisabled(true);

      const res = await getAdminDashboardOptions(
        {
          clientTime: Date.now(),
          timeFilterType: value,
        },
        authToken
      );

      const currentLink = window.location.href;

      const newLinkPart =
        window.location.origin +
        window.location.pathname +
        (value != "last-month" ? `?time-filter-type=${value}` : "");

      if (currentLink !== newLinkPart) {
        router.replace(newLinkPart, undefined, { shallow: true });
      }

      const resultCalculation = calculableInfos(
        res.userInactiveRegisterDatesCount,
        res.userRegisterDatesCount
      );

      setStatistic((prev) => ({ ...res, ...resultCalculation }));
    } catch (e) {
      error.set(e.message);
    } finally {
      setDisabled(false);
    }
  };

  useEffect(() => {
    const res = calculableInfos(
      props.userInactiveRegisterDatesCount,
      props.userRegisterDatesCount
    );

    setStatistic((prev) => ({ ...prev, ...res }));
  }, [props]);

  let timeType = "days";

  if (filterType == "last-day") {
    timeType = "hours";
  }

  if (filterType == "last-year") {
    timeType = "months";
  }

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="md:flex md:justify-between md:items-center mb-8">
              <BreadCrumbs links={[{ title: "Dashboard" }]} />

              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                <DateSelect
                  value={filterType}
                  setValue={handleChangeFilterType}
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-4">
                General metrics
              </h2>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <div className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
                <DashboardLineChart
                  title="Total transactions"
                  data={[statistic.transactionDatesCount]}
                  timeType={timeType}
                />
              </div>

              <div className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
                <DashboardLineChart
                  title="Total number of users"
                  data={[statistic.userTotalDatesCount]}
                  timeType={timeType}
                  getTotalType="last"
                />
              </div>

              <div className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
                <DashboardLineChart
                  title="Amount of total transactions"
                  data={[statistic.transactionDatesSum]}
                  timeType={timeType}
                  valueType="money"
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mt-4 mb-4">
                Payments
              </h2>
            </div>

            <div className="grid grid-cols-12 gap-6"> 
              <div className="col-span-full xl:col-span-12 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
                <TransactionAnalyticsTable
                  title={`Total amount (${STATIC.CURRENCY}) by type of payment`}
                  data={statistic.transactionsDetailInfo}
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mt-4 mb-4">
                Users
              </h2>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
                <DashboardDoughnutChart
                  title="Total Users"
                  data={{
                    "Active Users":
                      statistic.totalNewUsers - statistic.totalNewInactiveUsers,
                    "Inactive Users": statistic.totalNewInactiveUsers,
                  }}
                />
              </div>
              <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
                <DashboardLineChart
                  title="New Users"
                  data={[statistic.userRegisterDatesCount]}
                  timeType={timeType}
                  getTotalType="last"
                />
              </div>
              <div className="flex flex-col col-span-full xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
                <DashboardLineChart
                  title="Inactive Users"
                  data={[statistic.userInactiveRegisterDatesCount]}
                  timeType={timeType}
                  getTotalType="last"
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mt-4 mb-4">
                Disputes
              </h2>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-5 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
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
              <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-7 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
                <DashboardLineChart
                  title="Active Disputes"
                  data={[statistic.disputeTotalDatesCount]}
                  timeType={timeType}
                  getTotalType="last"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const boostServerSideProps = async ({ context, baseSideProps }) => {
  const data = await getAdminDashboardPageOptions(
    baseTimeTypePageParams(context.query),
    baseSideProps.authToken
  );
  return { ...data };
};

export const getServerSideProps = (context) =>
  supportSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "Admin dashboard" },
  });

export default AdminIndex;
