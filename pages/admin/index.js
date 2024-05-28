import React, { useState } from "react";
import Sidebar from "../../partials/admin/Sidebar";
import Header from "../../partials/admin/Header";
import WelcomeBanner from "../../partials/admin/dashboard/WelcomeBanner";
import { useAdminPage } from "../../hooks";
import { supportSideProps } from "../../middlewares";
import { getAdminIndexPageOptions } from "../../services";
import BreadCrumbs from "../../partials/admin/base/BreadCrumbs";
import DropdownFilter from "../../components/admin/DropdownFilter";
import FilterRadioOption from "../../components/admin/Form/FilterRadioOption";
import DateSelect from "../../components/admin/DateSelect";
import DashboardLineChart from "../../components/admin/DashboardLineChart";
import AnalyticsTable from "../../components/admin/AnalyticsTable";
import DashboardDoughnutChart from "../../components/admin/DashboardDoughnutChart";

const AdminIndex = () => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const [filterType, setFilterType] = useState("last_month");

  const handleChangeFilterType = (value) => {
    setFilterType(value);
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/*<WelcomeBanner />*/}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
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
              <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
                <DashboardLineChart title="Total transactions" />
              </div>

              <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
                <DashboardLineChart title="Total items listed" />
              </div>
              <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
                <DashboardLineChart title="Total number of users" />
              </div>
            </div>

            <div>
              <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mt-4 mb-4">
                Payments
              </h2>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
                <DashboardLineChart title="Amount of total transactions" />
              </div>
              <div className="col-span-full xl:col-span-8 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
                <AnalyticsTable title="Total amount ($) by type of payment" />
              </div>
            </div>

            <div>
              <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mt-4 mb-4">
                Users
              </h2>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
                <DashboardDoughnutChart title="Total Users" />
              </div>
              <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
                <DashboardLineChart title="New Users" />
              </div>
              <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
                <DashboardLineChart title="Inactive Users" />
              </div>
            </div>

            <div>
              <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mt-4 mb-4">
                Disputes
              </h2>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-5 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
                <DashboardDoughnutChart title="Total Disputes" />
              </div>
              <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-7 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
                <DashboardLineChart title="Active Disputes" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const boostServerSideProps = async ({ baseSideProps }) => {
  const data = await getAdminIndexPageOptions(baseSideProps.authToken);
  return { ...data };
};

export const getServerSideProps = (context) =>
  supportSideProps(context, boostServerSideProps);

export default AdminIndex;
