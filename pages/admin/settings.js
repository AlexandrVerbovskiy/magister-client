import React, { useState, useContext } from "react";
import Sidebar from "../../partials/admin/Sidebar";
import Header from "../../partials/admin/Header";
import BreadCrumbs from "../../partials/admin/base/BreadCrumbs";
import Switch from "../../partials/admin/base/Switch";
import lodash from "lodash";

import { adminSideProps } from "../../middlewares";
import { useAdminPage } from "../../hooks";
import {
  getSystemOptions as getSystemOptionsRequest,
  setSystemMainOptions as setSystemMainOptionsRequest,
  setSystemCommissionOptions as setSystemCommissionOptionsRequest,
  setSystemBankAccountOptions as setSystemBankAccountOptionsRequest,
  saveTrainingSettings,
  saveApiKey,
} from "../../services";
import { IndiceContext } from "../../contexts";
import Input from "../../components/admin/Form/Input";
import { validateSmallText } from "../../utils";
import TrainingSettingsSection from "../../components/admin/Settings/TrainingSettingsSection";
import ApiKeySection from "../../components/admin/Settings/ApiKeySection";

const Settings = ({
  userLogActive: baseUserLogActive,
  ownerBaseCommissionPercent: baseOwnerBaseCommissionPercent,
  ownerBoostCommissionPercent: baseOwnerBoostCommissionPercent,
  renterBaseCommissionPercent: baseRenterBaseCommissionPercent,
  renterCancelFeePercent: baseRenterCancelFeePercent,
  bankAccountIban: baseBankAccountIban,
  bankAccountSwiftBic: baseBankAccountSwiftBic,
  bankAccountBeneficiary: baseBankAccountBeneficiary,
  bankAccountReferenceConceptCode: baseBankAccountReferenceConceptCode,
  apiKey: baseApiKey,
  correlationThreshold: baseCorrelationThreshold,
  pValueThreshold: basePValueThreshold,
  nEstimators: baseNEstimators,
  randomState: baseRandomState,
  trainTestSplit: baseTrainTestSplit,
}) => {
  const { sidebarOpen, setSidebarOpen } = useAdminPage();
  const [baseProps, setBaseProps] = useState({
    userLogActive: baseUserLogActive,
    ownerBaseCommissionPercent: baseOwnerBaseCommissionPercent,
    ownerBoostCommissionPercent: baseOwnerBoostCommissionPercent,
    renterBaseCommissionPercent: baseRenterBaseCommissionPercent,
    renterCancelFeePercent: baseRenterCancelFeePercent,
    bankAccountIban: baseBankAccountIban,
    bankAccountSwiftBic: baseBankAccountSwiftBic,
    bankAccountBeneficiary: baseBankAccountBeneficiary,
    bankAccountReferenceConceptCode: baseBankAccountReferenceConceptCode,
    apiKey: baseApiKey,
    correlationThreshold: baseCorrelationThreshold,
    pValueThreshold: basePValueThreshold,
    nEstimators: baseNEstimators,
    randomState: baseRandomState,
    trainTestSplit: baseTrainTestSplit,
  });

  const [userLogActive, setUserLogActive] = useState(baseUserLogActive);
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const [ownerBaseCommissionPercent, setOwnerBaseCommissionPercent] = useState(
    baseOwnerBaseCommissionPercent ?? 0
  );
  const [ownerBaseCommissionPercentError, setOwnerBaseCommissionPercentError] =
    useState(null);

  const [ownerBoostCommissionPercent, setOwnerBoostCommissionPercent] =
    useState(baseOwnerBoostCommissionPercent ?? 0);
  const [
    ownerBoostCommissionPercentError,
    setOwnerBoostCommissionPercentError,
  ] = useState(null);

  const [renterBaseCommissionPercent, setRenterBaseCommissionPercent] =
    useState(baseRenterBaseCommissionPercent ?? 0);
  const [
    renterBaseCommissionPercentError,
    setRenterBaseCommissionPercentError,
  ] = useState(null);

  const [renterCancelFeePercent, setRenterCancelFeePercent] = useState(
    baseRenterCancelFeePercent ?? 0
  );
  const [renterCancelFeePercentError, setRenterCancelFeePercentError] =
    useState(null);

  const [bankAccountIban, setBankAccountIban] = useState(
    baseBankAccountIban ?? ""
  );
  const [bankAccountIbanError, setBankAccountIbanError] = useState(null);

  const [bankAccountSwiftBic, setBankAccountSwiftBic] = useState(
    baseBankAccountSwiftBic ?? ""
  );
  const [bankAccountSwiftBicError, setBankAccountSwiftBicError] =
    useState(null);

  const [bankAccountBeneficiary, setBankAccountBeneficiary] = useState(
    baseBankAccountBeneficiary ?? ""
  );
  const [bankAccountBeneficiaryError, setBankAccountBeneficiaryError] =
    useState(null);

  const [bankAccountReferenceConceptCode, setBankAccountReferenceConceptCode] =
    useState(baseBankAccountReferenceConceptCode ?? "");
  const [
    bankAccountReferenceConceptCodeError,
    setBankAccountReferenceConceptCodeError,
  ] = useState(null);

  const { authToken, success, error } = useContext(IndiceContext);

  const handleChange = async (value) => {
    try {
      setUserLogActive(value);
      await setSystemMainOptionsRequest({ userLogActive: value }, authToken);
      success.set(
        value ? "Activated successfully" : "Deactivated successfully"
      );
    } catch (e) {
      error.set(e.message);
    }
  };

  const commissionStateToOptions = () => ({
    ownerBaseCommissionPercent,
    ownerBoostCommissionPercent,
    renterBaseCommissionPercent,
    renterCancelFeePercent,
  });

  const bankAccountStateToOptions = () => ({
    bankAccountIban,
    bankAccountSwiftBic,
    bankAccountBeneficiary,
    bankAccountReferenceConceptCode,
  });

  const propsToState = (props) => {
    setUserLogActive(props.userLogActive);

    setOwnerBaseCommissionPercent(props.ownerBaseCommissionPercent);
    setOwnerBoostCommissionPercent(props.ownerBoostCommissionPercent);
    setRenterBaseCommissionPercent(props.renterBaseCommissionPercent);
    setRenterCancelFeePercent(props.renterCancelFeePercent);

    setBankAccountIban(props.bankAccountIban);
    setBankAccountSwiftBic(props.bankAccountSwiftBic);
    setBankAccountBeneficiary(props.bankAccountBeneficiary);
    setBankAccountReferenceConceptCode(props.bankAccountReferenceConceptCode);
  };

  const commissionHasChanges = () => {
    return !lodash.isEqual(commissionStateToOptions(), {
      ownerBaseCommissionPercent: baseProps.ownerBaseCommissionPercent,
      ownerBoostCommissionPercent: baseProps.ownerBoostCommissionPercent,
      renterBaseCommissionPercent: baseProps.renterBaseCommissionPercent,
      renterCancelFeePercent: baseProps.renterCancelFeePercent,
    });
  };

  const bankAccountHasChanges = () => {
    return !lodash.isEqual(bankAccountStateToOptions(), {
      bankAccountIban: baseProps.bankAccountIban,
      bankAccountSwiftBic: baseProps.bankAccountSwiftBic,
      bankAccountBeneficiary: baseProps.bankAccountBeneficiary,
      bankAccountReferenceConceptCode:
        baseProps.bankAccountReferenceConceptCode,
    });
  };

  const handleSaveCommissionClick = async () => {
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

    if (!renterCancelFeePercent) {
      setRenterCancelFeePercentError("Requested field");
      hasError = true;
    }

    if (
      renterCancelFeePercent &&
      (isNaN(Number(renterCancelFeePercent)) ||
        Number(renterCancelFeePercent) < 0 ||
        Number(renterCancelFeePercent) > 99)
    ) {
      setRenterCancelFeePercentError("Invalid field");
      hasError = true;
    }

    if (!renterBaseCommissionPercent) {
      setRenterBaseCommissionPercentError("Requested field");
      hasError = true;
    }

    if (
      renterBaseCommissionPercent &&
      (isNaN(Number(renterBaseCommissionPercent)) ||
        Number(renterBaseCommissionPercent) < 0 ||
        Number(renterBaseCommissionPercent) > 99)
    ) {
      setRenterBaseCommissionPercentError("Invalid field");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      if (commissionHasChanges()) {
        setSubmitDisabled(true);
        const newProps = await setSystemCommissionOptionsRequest(
          commissionStateToOptions(),
          authToken
        );

        setBaseProps((prev) => ({ ...prev, ...newProps }));
        propsToState({ ...baseProps, ...newProps });
      }

      success.set("Operation done success");
    } catch (e) {
      error.set(e.message);
    } finally {
      setSubmitDisabled(false);
    }
  };

  const handleSaveBankAccountClick = async () => {
    if (submitDisabled) {
      return;
    }

    let hasError = false;

    if (!bankAccountBeneficiary.trim()) {
      setBankAccountBeneficiaryError("Required field");
      hasError = true;
    } else {
      if (validateSmallText(bankAccountBeneficiary) !== true) {
        setBankAccountBeneficiaryError("Invalid field");
        hasError = true;
      }
    }

    if (!bankAccountIban.trim()) {
      setBankAccountIbanError("Required field");
      hasError = true;
    } else {
      if (validateSmallText(bankAccountIban) !== true) {
        setBankAccountIbanError("Invalid field");
        hasError = true;
      }
    }

    if (!bankAccountReferenceConceptCode.trim()) {
      setBankAccountReferenceConceptCodeError("Required field");
      hasError = true;
    } else {
      if (validateSmallText(bankAccountReferenceConceptCode) !== true) {
        setBankAccountReferenceConceptCodeError("Invalid field");
        hasError = true;
      }
    }

    if (!bankAccountSwiftBic.trim()) {
      setBankAccountSwiftBicError("Required field");
      hasError = true;
    } else {
      if (validateSmallText(bankAccountSwiftBic) !== true) {
        setBankAccountSwiftBicError("Invalid field");
        hasError = true;
      }
    }

    if (hasError) {
      return;
    }

    try {
      if (bankAccountHasChanges()) {
        setSubmitDisabled(true);
        const newProps = await setSystemBankAccountOptionsRequest(
          bankAccountStateToOptions(),
          authToken
        );

        setBaseProps((prev) => ({ ...prev, ...newProps }));
        propsToState({ ...baseProps, ...newProps });
      }

      success.set("Operation done success");
    } catch (e) {
      error.set(e.message);
    } finally {
      setSubmitDisabled(false);
    }
  };

  const handleSaveApiKeyClick = async (apiKey) => {
    try {
      await saveApiKey(apiKey, authToken);
      success.set("Operation done success");
    } catch (e) {
      error.set(e.message);
    }
  };

  const handleSaveTrainingSettings = async ({
    correlationThreshold,
    pValueThreshold,
    nEstimators,
    randomState,
    trainTestSplit,
  }) => {
    try {
      await saveTrainingSettings(
        {
          correlationThreshold,
          pValueThreshold,
          nEstimators,
          randomState,
          trainTestSplit,
        },
        authToken
      );
      success.set("Operation done success");
    } catch (e) {
      error.set(e.message);
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
              <div className="mb-8">
                <BreadCrumbs links={[{ title: "Settings" }]} />
              </div>

              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
                <div className="flex flex-col md:flex-row md:-mr-px">
                  <div className="grow w-full">
                    <div className="p-6 space-y-6">
                      <h2 className="max-w-full overflow-separate text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5">
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
                  <div className="grow w-full">
                    <div className="p-6 space-y-6">
                      <h2 className="max-w-full overflow-separate text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5">
                        Commission Settings
                      </h2>

                      <section style={{ marginTop: "0" }}>
                        <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                          <div className="sm:w-5/12">
                            <Input
                              name="ownerCommission"
                              value={ownerBaseCommissionPercent}
                              setValue={setOwnerBaseCommissionPercent}
                              error={ownerBaseCommissionPercentError}
                              setError={setOwnerBaseCommissionPercentError}
                              label="Listing Owner Commission (%)"
                              labelClassName="block text-sm font-medium mb-1"
                              inputClassName="form-input w-full"
                            />
                          </div>
                        </div>

                        <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                          <div className="sm:w-5/12">
                            <Input
                              name="boostOwnerCommission"
                              value={ownerBoostCommissionPercent}
                              setValue={setOwnerBoostCommissionPercent}
                              error={ownerBoostCommissionPercentError}
                              setError={setOwnerBoostCommissionPercentError}
                              label="Listing Owner Commission For Boost Position (%)"
                              labelClassName="block text-sm font-medium mb-1"
                              inputClassName="form-input w-full"
                            />
                          </div>
                        </div>

                        <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                          <div className="sm:w-5/12">
                            <Input
                              name="boostOwnerCommission"
                              value={renterBaseCommissionPercent}
                              setValue={setRenterBaseCommissionPercent}
                              error={renterBaseCommissionPercentError}
                              setError={setRenterBaseCommissionPercentError}
                              label="Rental Rent Commission (%)"
                              labelClassName="block text-sm font-medium mb-1"
                              inputClassName="form-input w-full"
                            />
                          </div>
                        </div>

                        <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                          <div className="sm:w-5/12">
                            <Input
                              name="renterCancelCommission"
                              value={renterCancelFeePercent}
                              setValue={setRenterCancelFeePercent}
                              error={renterCancelFeePercentError}
                              setError={setRenterCancelFeePercentError}
                              label="Renter Cancel Commission (%)"
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
                          <button
                            disabled={submitDisabled}
                            type="button"
                            onClick={handleSaveCommissionClick}
                            className="btn bg-teal-500 hover:bg-teal-600 text-white ml-3"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </footer>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
                <div className="flex flex-col md:flex-row md:-mr-px">
                  <div className="grow w-full">
                    <div className="p-6 space-y-6">
                      <h2 className="max-w-full overflow-separate text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5">
                        Bank Account Settings
                      </h2>

                      <section style={{ marginTop: "0" }}>
                        <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                          <div className="sm:w-5/12">
                            <Input
                              name="bankAccountReferenceConceptCode"
                              value={bankAccountReferenceConceptCode}
                              setValue={setBankAccountReferenceConceptCode}
                              error={bankAccountReferenceConceptCodeError}
                              setError={setBankAccountReferenceConceptCodeError}
                              label="Sort Code"
                              labelClassName="block text-sm font-medium mb-1"
                              inputClassName="form-input w-full"
                            />
                          </div>
                        </div>

                        <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                          <div className="sm:w-5/12">
                            <Input
                              name="bankAccountBeneficiary"
                              value={bankAccountBeneficiary}
                              setValue={setBankAccountBeneficiary}
                              error={bankAccountBeneficiaryError}
                              setError={setBankAccountBeneficiaryError}
                              label="Account No"
                              labelClassName="block text-sm font-medium mb-1"
                              inputClassName="form-input w-full"
                            />
                          </div>
                        </div>

                        <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                          <div className="sm:w-5/12">
                            <Input
                              name="bankAccountIban"
                              value={bankAccountIban}
                              setValue={setBankAccountIban}
                              error={bankAccountIbanError}
                              setError={setBankAccountIbanError}
                              label="IBAN"
                              labelClassName="block text-sm font-medium mb-1"
                              inputClassName="form-input w-full"
                            />
                          </div>
                        </div>

                        <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                          <div className="sm:w-5/12">
                            <Input
                              name="bankAccountSwiftBic"
                              value={bankAccountSwiftBic}
                              setValue={setBankAccountSwiftBic}
                              error={bankAccountSwiftBicError}
                              setError={setBankAccountSwiftBicError}
                              label="BIC"
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
                          <button
                            disabled={submitDisabled}
                            type="button"
                            onClick={handleSaveBankAccountClick}
                            className="btn bg-teal-500 hover:bg-teal-600 text-white ml-3"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </footer>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
                <ApiKeySection
                  initialApiKey={baseProps.apiKey}
                  onSave={handleSaveApiKeyClick}
                />
              </div>

              <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
                <TrainingSettingsSection
                  initialSettings={{
                    correlationThreshold: baseProps.correlationThreshold,
                    pValueThreshold: baseProps.pValueThreshold,
                    nEstimators: baseProps.nEstimators,
                    randomState: baseProps.randomState,
                    trainTestSplit: baseProps.trainTestSplit,
                  }}
                  onSave={handleSaveTrainingSettings}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const boostServerSideProps = async ({ baseSideProps }) => {
  return await getSystemOptionsRequest(baseSideProps.authToken);
};

export const getServerSideProps = (context) =>
  adminSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "Settings" },
  });

export default Settings;
