import { useAdminPage } from "../../../hooks";
import BreadCrumbs from "../../../partials/admin/base/BreadCrumbs";
import Header from "../../../partials/admin/Header";
import Sidebar from "../../../partials/admin/Sidebar";
import { adminSideProps } from "../../../middlewares";

const DisputePredictionList = (pageProps) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  console.log(pageProps);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden dark:bg-slate-900">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="relative">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className="md:flex md:justify-between md:items-center mb-8">
                <BreadCrumbs links={[{ title: "Dispute Predictions" }]} />
              </div>

              <div className="mt-8"></div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export const getServerSideProps = (context) =>
  adminSideProps({
    context,
    baseProps: { pageTitle: "Dispute Predictions" },
  });

export default DisputePredictionList;
