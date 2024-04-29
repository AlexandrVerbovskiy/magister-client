import React, { useState, useContext, useEffect } from "react";
import Sidebar from "../../partials/admin/Sidebar";
import Header from "../../partials/admin/Header";
import BreadCrumbs from "../../partials/admin/base/BreadCrumbs";
import Switch from "../../partials/admin/base/Switch";
import lodash from "lodash";

import { adminSideProps } from "../../middlewares";
import { useAdminPage } from "../../hooks";
import {
  getSystemOptions as getSystemOptionsRequest,
  setSystemOptions as setSystemOptionsRequest,
} from "../../services";
import { IndiceContext } from "../../contexts";
import LeaveBtn from "../../components/admin/LeaveBtn";
import Input from "../../components/admin/Form/Input";

const goBackLink = "/admin";

const Settings = ({
  userLogActive: baseUserLogActive,
  ownerBaseCommissionPercent: baseOwnerBaseCommissionPercent,
  ownerBoostCommissionPercent: baseOwnerBoostCommissionPercent,
  tenantBaseCommissionPercent: baseTenantBaseCommissionPercent,
}) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const [baseProps, setBaseProps] = useState({
    userLogActive: baseUserLogActive,
    ownerBaseCommissionPercent: baseOwnerBaseCommissionPercent,
    ownerBoostCommissionPercent: baseOwnerBoostCommissionPercent,
    tenantBaseCommissionPercent: baseTenantBaseCommissionPercent,
  });
  const [userLogActive, setUserLogActive] = useState(baseUserLogActive);
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const [ownerBaseCommissionPercent, setOwnerBaseCommissionPercent] = useState(
    baseOwnerBaseCommissionPercent
  );
  const [ownerBaseCommissionPercentError, setOwnerBaseCommissionPercentError] =
    useState(null);

  const [ownerBoostCommissionPercent, setOwnerBoostCommissionPercent] =
    useState(baseOwnerBoostCommissionPercent);
  const [
    ownerBoostCommissionPercentError,
    setOwnerBoostCommissionPercentError,
  ] = useState(null);

  const [tenantBaseCommissionPercent, setTenantBaseCommissionPercent] =
    useState(baseTenantBaseCommissionPercent);
  const [
    tenantBaseCommissionPercentError,
    setTenantBaseCommissionPercentError,
  ] = useState(null);

  const { authToken, success, error } = useContext(IndiceContext);

  const handleChange = async (value) => setUserLogActive(value);

  const stateToOptions = () => ({
    userLogActive,
    ownerBaseCommissionPercent,
    ownerBoostCommissionPercent,
    tenantBaseCommissionPercent,
  });

  const propsToState = (props) => {
    setUserLogActive(props.userLogActive);
    setOwnerBaseCommissionPercent(props.ownerBaseCommissionPercent);
    setOwnerBoostCommissionPercent(props.ownerBoostCommissionPercent);
    setTenantBaseCommissionPercent(props.tenantBaseCommissionPercent);
  };

  const hasChanges = () => {
    return !lodash.isEqual(stateToOptions(), baseProps);
  };

  const handleSaveClick = async () => {
    if (submitDisabled) {
      return;
    }

    let hasError = false;

    if (!ownerBaseCommissionPercent) {
      setOwnerBaseCommissionPercentError("Requested field");
      hasError = true;
    }

    if (
      ownerBaseCommissionPercent &&
      (isNaN(Number(ownerBaseCommissionPercent)) ||
        Number(ownerBaseCommissionPercent) < 0 ||
        Number(ownerBaseCommissionPercent) > 99)
    ) {
      setOwnerBaseCommissionPercentError("Invalid field");
      hasError = true;
    }

    if (!ownerBoostCommissionPercent) {
      setOwnerBoostCommissionPercentError("Requested field");
      hasError = true;
    }

    if (
      ownerBoostCommissionPercent &&
      (isNaN(Number(ownerBoostCommissionPercent)) ||
        Number(ownerBoostCommissionPercent) < 0 ||
        Number(ownerBoostCommissionPercent) > 99)
    ) {
      setOwnerBoostCommissionPercentError("Invalid field");
      hasError = true;
    }

    if (!tenantBaseCommissionPercent) {
      setTenantBaseCommissionPercentError("Requested field");
      hasError = true;
    }

    if (
      tenantBaseCommissionPercent &&
      (isNaN(Number(tenantBaseCommissionPercent)) ||
        Number(tenantBaseCommissionPercent) < 0 ||
        Number(tenantBaseCommissionPercent) > 99)
    ) {
      setTenantBaseCommissionPercentError("Invalid field");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      if (hasChanges()) {
        setSubmitDisabled(true);
        const newProps = await setSystemOptionsRequest(
          stateToOptions(),
          authToken
        );

        setBaseProps(newProps);
        propsToState(newProps);
      }

      success.set("Operation done success");
    } catch (e) {
      error.set(e.message);
    } finally {
      setSubmitDisabled(false);
    }
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden dark:bg-slate-900">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="relative">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <div className="sm:flex sm:justify-between sm:items-center mb-8">
                <BreadCrumbs links={[{ title: "Settings" }]} />
              </div>

              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
                <div className="flex flex-col md:flex-row md:-mr-px">
                  <div className="grow">
                    <div className="p-6 space-y-6">
                      <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5">
                        Main
                      </h2>

                      <section>
                        <div className="flex flex-wrap mt-2">
                          <div className="mr-6">User Log</div>
                          <Switch
                            id="email-toggle"
                            checked={userLogActive}
                            changeChecked={() => handleChange(!userLogActive)}
                            onText="Active"
                            offText="Inactive"
                          />
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
                <div className="flex flex-col md:flex-row md:-mr-px">
                  <div className="grow">
                    <div className="p-6 space-y-6">
                      <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5">
                        Commission Settings
                      </h2>

                      <section style={{ marginTop: "0" }}>
                        <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                          <div className="sm:w-1/3">
                            <Input
                              name="ownerCommission"
                              value={ownerBaseCommissionPercent}
                              setValue={setOwnerBaseCommissionPercent}
                              error={ownerBaseCommissionPercentError}
                              setError={setOwnerBaseCommissionPercentError}
                              label="Listing Owner Commission"
                              labelClassName="block text-sm font-medium mb-1"
                              inputClassName="form-input w-full"
                            />
                          </div>
                        </div>

                        <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                          <div className="sm:w-1/3">
                            <Input
                              name="boostOwnerCommission"
                              value={ownerBoostCommissionPercent}
                              setValue={setOwnerBoostCommissionPercent}
                              error={ownerBoostCommissionPercentError}
                              setError={setOwnerBoostCommissionPercentError}
                              label="Listing Owner Commission For Boost Position"
                              labelClassName="block text-sm font-medium mb-1"
                              inputClassName="form-input w-full"
                            />
                          </div>
                        </div>

                        <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                          <div className="sm:w-1/3">
                            <Input
                              name="boostOwnerCommission"
                              value={tenantBaseCommissionPercent}
                              setValue={setTenantBaseCommissionPercent}
                              error={tenantBaseCommissionPercentError}
                              setError={setTenantBaseCommissionPercentError}
                              label="Rental Rent Commission"
                              labelClassName="block text-sm font-medium mb-1"
                              inputClassName="form-input w-full"
                            />
                          </div>
                        </div>
                      </section>
                    </div>

                    <footer>
                      <div className="flex flex-col px-6 py-5 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex self-end">
                          <LeaveBtn
                            hasChanges={hasChanges}
                            goBackLink={goBackLink}
                          />

                          <button
                            disabled={submitDisabled}
                            type="button"
                            onClick={handleSaveClick}
                            className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </footer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const boostServerSideProps = async ({ baseSideProps }) => {
  const {
    userLogActive,
    ownerBaseCommissionPercent,
    ownerBoostCommissionPercent,
    tenantBaseCommissionPercent,
  } = await getSystemOptionsRequest(baseSideProps.authToken);

  return {
    userLogActive,
    ownerBaseCommissionPercent,
    ownerBoostCommissionPercent,
    tenantBaseCommissionPercent,
  };
};

export const getServerSideProps = (context) =>
  adminSideProps(context, boostServerSideProps);

export default Settings;
