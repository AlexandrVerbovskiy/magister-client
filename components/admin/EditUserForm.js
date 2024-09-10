import React, { useState, useEffect, useContext } from "react";
import Router, { useRouter } from "next/router";
import lodash from "lodash";

import { IndiceContext } from "../../contexts";
import Sidebar from "../../partials/admin/Sidebar";
import Header from "../../partials/admin/Header";
import BreadCrumbs from "../../partials/admin/base/BreadCrumbs";
import { useAdminPage } from "../../hooks";
import Switch from "../../partials/admin/base/Switch";
import DropdownClassic from "./DropdownClassic";
import ModalBlank from "./ModalBlank";
import ImageInput from "./Form/ImageInput";
import Input from "./Form/Input";
import Textarea from "./Form/Textarea";
import {
  getFilePath,
  validateEmail,
  validatePhoneNumber,
  validateUrl,
  validateSmallText,
  validateBigText,
  validateInteger,
} from "../../utils";
import ErrorSpan from "./ErrorSpan";
import LeaveBtn from "./LeaveBtn";
import STATIC from "../../static";
import PhoneInput from "react-phone-input-2";
import {parsePhoneNumberFromString} from "libphonenumber-js";

const roleOptions = [
  { value: "user", title: "User", default: true },
  { value: "support", title: "Support" },
];

const EditUserForm = ({ user, save, currentTitle }) => {
  const [prevUserInfo, setPrevUserInfo] = useState(user);

  const { error, success } = useContext(IndiceContext);
  const { sidebarOpen, setSidebarOpen } = useAdminPage();

  const [newPhoto, setNewPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(null);
  const [role, setRole] = useState("user");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(null);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [phoneCountryCode, setPhoneCountryCode] = useState("");

  const [briefBio, setBriefBio] = useState("");

  const [briefBioError, setBriefBioError] = useState(null);

  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [linkedinUrlError, setLinkedinUrlError] = useState(null);

  const [facebookUrl, setFacebookUrl] = useState("");
  const [facebookUrlError, setFacebookUrlError] = useState(null);

  const [paypalId, setPaypalId] = useState("");
  const [paypalIdError, setPaypalIdError] = useState(null);

  const [instagramUrl, setInstagramUrl] = useState("");
  const [instagramUrlError, setInstagramUrlError] = useState(null);

  const [twoFactorAuthentication, setTwoFactorAuthentication] = useState(false);
  const [active, setActive] = useState(false);
  const [verified, setVerified] = useState(false);
  const [suspicious, setSuspicious] = useState(false);

  const [submitDisabled, setSubmitDisabled] = useState(false);

  useEffect(() => {
    if (user && user.photo) {
      setPhotoUrl(getFilePath(user.photo));
    } else {
      setPhotoUrl(null);
    }

    const resUserToState = userToState(user);

    setName(resUserToState.name);
    setEmail(resUserToState.email);
    setEmailVerified(resUserToState.emailVerified);
    setPhoneVerified(resUserToState.phoneVerified);

    if (resUserToState.role) {
      setRole(resUserToState.role);
    } else {
      const defaultRole = roleOptions.find((role) => role.default).value;
      setRole(defaultRole);
    }

    setFacebookUrl(resUserToState.facebookUrl);
    setLinkedinUrl(resUserToState.linkedinUrl);
    setInstagramUrl(resUserToState.instagramUrl);
    setBriefBio(resUserToState.briefBio);
    setTwoFactorAuthentication(resUserToState.twoFactorAuthentication);
    setActive(resUserToState.active);
    setSuspicious(resUserToState.suspicious);
    setVerified(resUserToState.verified);
    setPaypalId(resUserToState.paypalId);

    if (resUserToState.phone) {
      const phoneNumber = parsePhoneNumberFromString(
        "+" + resUserToState.phone
      );

      const phoneCountry = phoneNumber?.country;

      if (phoneNumber && phoneCountry) {
        setPhoneCountryCode(phoneCountry.toLocaleLowerCase());
        setPhone(resUserToState.phone);
      } else {
        setPhoneCountryCode(STATIC.DEFAULT_PHONE_INFO.code);
        setPhone(STATIC.DEFAULT_PHONE_INFO.phone);
      }
    } else {
      setPhoneCountryCode(STATIC.DEFAULT_PHONE_INFO.code);
      setPhone(STATIC.DEFAULT_PHONE_INFO.phone);
    }
  }, [user.id]);

  const getObjectToSave = () => {
    const obj = {
      name: name.trim(),
      role: role.trim(),
      email: email.trim(),
      verified,
      emailVerified,
      phoneVerified,
      twoFactorAuthentication,
      active,
      suspicious,
    };

    if (phone.trim()) {
      obj["phone"] = phone.trim();
    }

    if (facebookUrl.trim()) {
      obj["facebookUrl"] = facebookUrl.trim();
    }

    if (linkedinUrl.trim()) {
      obj["linkedinUrl"] = linkedinUrl.trim();
    }

    if (instagramUrl.trim()) {
      obj["instagramUrl"] = instagramUrl.trim();
    }

    if (briefBio.trim()) {
      obj["briefBio"] = briefBio.trim();
    }

    if (paypalId.trim()) {
      obj["paypalId"] = paypalId.trim();
    }

    return obj;
  };

  const userToState = (user) => ({
    name: user.name ?? "",
    role: user.role ?? "",
    phone: user.phone ?? "",
    email: user.email ?? "",
    linkedinUrl: user.linkedinUrl ?? "",
    facebookUrl: user.facebookUrl ?? "",
    instagramUrl: user.instagramUrl ?? "",
    emailVerified: user.emailVerified ?? false,
    phoneVerified: user.phoneVerified ?? false,
    twoFactorAuthentication: user.twoFactorAuthentication ?? true,
    briefBio: user.briefBio ?? "",
    active: user.active ?? false,
    suspicious: user.suspicious ?? false,
    verified: user.verified ?? false,
    paypalId: user.paypalId ?? "",
  });

  const hasChanges = () => {
    if (newPhoto) return true;

    const dataToSave = getObjectToSave();
    const userToCheck = userToState(prevUserInfo);

    return !lodash.isEqual(userToCheck, dataToSave);
  };

  const handlePhotoChange = (e) => {
    const img = e.target.files[0];
    const url = URL.createObjectURL(img);

    setNewPhoto(img);
    setPhotoUrl(url);
  };

  const handleSaveClick = async () => {
    if (submitDisabled) return;

    setSubmitDisabled(true);

    if (!hasChanges()) {
      success.set("User saved successfully");
      setSubmitDisabled(false);
      return;
    }

    let hasError = false;

    if (!name.trim()) {
      setNameError("Required field");
      hasError = true;
    }

    const resNameValidation = validateSmallText(name);

    if (resNameValidation !== true) {
      setNameError(resNameValidation);
      hasError = true;
    }

    const resValidateEmail = validateEmail(email);

    if (resValidateEmail !== true) {
      setEmailError(resValidateEmail);
      hasError = true;
    }

    const resValidatePhone = validatePhoneNumber(phone, phoneCountryCode);

    if (phone && resValidatePhone !== true) {
      setPhoneError(resValidatePhone);
      hasError = true;
    }

    const resValidateFacebookLink = validateUrl(facebookUrl);

    if (facebookUrl && resValidateFacebookLink !== true) {
      setFacebookUrlError(resValidateFacebookLink);
      hasError = true;
    }

    const resValidateLinkedinLink = validateUrl(linkedinUrl);

    if (linkedinUrl && resValidateLinkedinLink !== true) {
      setLinkedinUrlError(resValidateLinkedinLink);
      hasError = true;
    }

    const resValidateInstagramLink = validateUrl(instagramUrl);

    if (instagramUrl && resValidateInstagramLink !== true) {
      setInstagramUrlError(resValidateInstagramLink);
      hasError = true;
    }

    const resBriefBioValidation = validateBigText(briefBio);

    if (resBriefBioValidation !== true) {
      setBriefBioError(resBriefBioValidation);
      hasError = true;
    }

    const resPaypalIdValidation = validateSmallText(paypalId);

    if (resPaypalIdValidation !== true) {
      setPaypalIdError(resPaypalIdValidation);
      hasError = true;
    }

    if (hasError) {
      setSubmitDisabled(false);
      return;
    }

    const formData = new FormData();

    if (newPhoto) {
      formData.append("photo", newPhoto);
    }

    const objectToSave = getObjectToSave();

    Object.keys(objectToSave).forEach((key) =>
      formData.append(key, objectToSave[key])
    );

    try {
      const { user } = await save(formData);
      setPrevUserInfo(user);
      success.set("User saved successfully");

      if (user.photo) {
        setNewPhoto(null);
        setPhotoUrl(getFilePath(user.photo));
      }
    } catch (e) {
      error.set(e.message);
    } finally {
      setSubmitDisabled(false);
    }
  };

  const handleChangeEmail = (value) => {
    if (value.length < 1) setEmailVerified(false);
    setEmail(value);
  };

  const handleChangePhone = (newPhone, countryData) => {
    if (newPhone.length < 1) {
      setPhoneVerified(false);
    }

    setPhone(newPhone);
    setPhoneCountryCode(countryData.countryCode);
    setPhoneError(null);
  };

  const handleChangePhoneVerified = (value) => {
    if (phone.length < 1) {
      setPhoneError("An empty phone cannot be verified");
    } else {
      setPhoneVerified(value);
    }
  };

  const handleChangeEmailVerified = (value) => {
    if (email.length < 1) {
      setEmailError("An empty email cannot be verified");
    } else {
      setEmailVerified(value);
    }
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden dark:bg-slate-900">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="mb-8">
              <BreadCrumbs
                links={[
                  { title: "Users", href: "/admin/users" },
                  { title: currentTitle },
                ]}
              />
            </div>

            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
              <div className="flex flex-col md:flex-row md:-mr-px">
                <div className="grow w-full">
                  <div className=" p-6 space-y-6">
                    <h2 className="max-w-full overflow-separate text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5">
                      {currentTitle}
                    </h2>

                    <section>
                      <ImageInput
                        photoUrl={photoUrl}
                        onChange={handlePhotoChange}
                      />
                    </section>

                    <section>
                      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                        Business Profile
                      </h2>
                      <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                        <div className="sm:w-1/4">
                          <Input
                            name="name"
                            value={name}
                            setValue={setName}
                            error={nameError}
                            setError={setNameError}
                            label="User Name"
                            labelClassName="block text-sm font-medium mb-1"
                          />
                        </div>
                        <div className="sm:w-1/4">
                          <label
                            className="block text-sm font-medium mb-1"
                            htmlFor="role"
                          >
                            User Role
                          </label>
                          <DropdownClassic
                            options={roleOptions}
                            selected={role}
                            setSelected={setRole}
                            needSearch={false}
                          />
                        </div>
                      </div>
                    </section>

                    <section>
                      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                        Email
                      </h2>
                      <div className="flex flex-wrap mt-2">
                        <div className="mr-2">
                          <Input
                            name="email"
                            value={email}
                            setValue={handleChangeEmail}
                            setError={setEmailError}
                            label="Business Email"
                            labelClassName="sr-only"
                          />
                        </div>
                        <Switch
                          id="email-toggle"
                          checked={emailVerified}
                          changeChecked={() =>
                            handleChangeEmailVerified(!emailVerified)
                          }
                          onText="Verified"
                          offText="Not verified"
                        />
                      </div>
                      <ErrorSpan error={emailError} />
                    </section>

                    <section>
                      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                        Phone
                      </h2>
                      <div className="flex flex-wrap mt-2">
                        <div className="mr-2">
                          <PhoneInput
                            value={phone}
                            onChange={handleChangePhone}
                            onlyCountries={STATIC.PHONE_COUNTRIES_CODES}
                            inputProps={{ name: "phone" }}
                            placeholder="Phone Number"
                            specialLabel={null}
                            inputClass="form-input w-full"
                          />
                        </div>

                        <Switch
                          id="phone-toggle"
                          checked={phoneVerified}
                          changeChecked={() =>
                            handleChangePhoneVerified(!phoneVerified)
                          }
                          onText="Verified"
                          offText="Not verified"
                        />
                      </div>
                      <ErrorSpan error={phoneError} />
                    </section>

                    <section>
                      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                        Social networks
                      </h2>
                      <div className="text-sm">
                        Share your story: LinkedIn, Facebook, Instagram links
                        welcome
                      </div>

                      <div className="space-y-2 mt-5">
                        <div className="sm:w-1/4">
                          <Input
                            name="facebookUrl"
                            value={facebookUrl}
                            setValue={setFacebookUrl}
                            error={facebookUrlError}
                            setError={setFacebookUrlError}
                            label="Facebook URL"
                            labelClassName="block text-sm font-medium mb-1"
                          />
                        </div>
                        <div className="sm:w-1/4">
                          <Input
                            name="linkedinUrl"
                            value={linkedinUrl}
                            setValue={setLinkedinUrl}
                            error={linkedinUrlError}
                            setError={setLinkedinUrlError}
                            label="LinkedIn URL"
                            labelClassName="block text-sm font-medium mb-1"
                          />
                        </div>
                        <div className="sm:w-1/4">
                          <Input
                            name="instagramUrl"
                            value={instagramUrl}
                            setValue={setInstagramUrl}
                            error={instagramUrlError}
                            setError={setInstagramUrlError}
                            label="Instagram URL"
                            labelClassName="block text-sm font-medium mb-1"
                          />
                        </div>
                      </div>
                    </section>

                    <section>
                      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                        Payment Info
                      </h2>
                      <div className="text-sm">
                        The data that will automatically be used to receive
                        money
                      </div>

                      <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                        <div className="sm:w-1/4">
                          <Input
                            name="paypal-id"
                            value={paypalId}
                            setValue={setPaypalId}
                            error={paypalIdError}
                            setError={setPaypalIdError}
                            label="Paypal Id"
                            labelClassName="block text-sm font-medium mb-1"
                            placeholder="Paypal id"
                          />
                        </div>
                      </div>
                    </section>

                    <section>
                      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                        Two-Factor Authentication
                      </h2>

                      <div className="flex flex-wrap mt-2">
                        <div className="mr-2">
                          <label
                            className="block text-sm font-medium mb-1"
                            htmlFor="two-factor-auth"
                          >
                            Enable Two-Factor Authentication for added security.
                          </label>
                        </div>
                        <Switch
                          id="two-factor-auth"
                          checked={twoFactorAuthentication}
                          changeChecked={() =>
                            setTwoFactorAuthentication(!twoFactorAuthentication)
                          }
                          onText="On"
                          offText="Off"
                        />
                      </div>
                    </section>

                    <section>
                      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                        Active
                      </h2>
                      <div className="flex flex-wrap mt-2">
                        <div className="mr-2">
                          <label
                            className="block text-sm font-medium mb-1"
                            htmlFor="active"
                          >
                            Activated by selecting, deactivated by deselecting.
                          </label>
                        </div>
                        <Switch
                          id="active"
                          checked={active}
                          changeChecked={() => setActive(!active)}
                          onText="Active"
                          offText="Not active"
                        />
                      </div>
                    </section>

                    <section>
                      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                        Verified
                      </h2>
                      <div className="flex flex-wrap mt-2">
                        <div className="mr-2">
                          <label
                            className="block text-sm font-medium mb-1"
                            htmlFor="verified"
                          >
                            Verified by checking the box, unverified by leaving
                            it unchecked.
                          </label>
                        </div>
                        <Switch
                          id="verified"
                          checked={verified}
                          changeChecked={() => setVerified(!verified)}
                          onText="Verified"
                          offText="Not verified"
                        />
                      </div>
                    </section>

                    <section>
                      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                        Suspicious
                      </h2>
                      <div className="flex flex-wrap mt-2">
                        <div className="mr-2">
                          <label
                            className="block text-sm font-medium mb-1"
                            htmlFor="suspicious"
                          >
                            Questionable activity? Dive into Suspicious.
                          </label>
                        </div>
                        <Switch
                          id="suspicious"
                          checked={suspicious}
                          changeChecked={() => setSuspicious(!suspicious)}
                          onText="Yes"
                          offText="No"
                        />
                      </div>
                    </section>

                    <section>
                      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                        Brief Info
                      </h2>

                      <div className="text-sm">
                        Tell us a bit about yourself
                      </div>

                      <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                        <Textarea
                          name="briefBio"
                          value={briefBio}
                          setValue={setBriefBio}
                          error={briefBioError}
                          setError={setBriefBioError}
                        />
                      </div>
                    </section>
                  </div>

                  <footer>
                    <div className="flex flex-col px-6 py-5 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex self-end">
                        <LeaveBtn
                          hasChanges={hasChanges}
                          goBackLink="/admin/users"
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
        </main>
      </div>
    </div>
  );
};

export default EditUserForm;
