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
} from "../../utils";
import ErrorSpan from "./ErrorSpan";

const roleOptions = [
  { value: "user", title: "User", default: true },
  { value: "support", title: "Support" },
];

const EditUserForm = ({ user, save, currentTitle }) => {
  const [accessLeaveModalOpen, setAccessLeaveModalOpen] = useState(false);

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

  const [contactDetails, setContactDetails] = useState("");
  const [briefBio, setBriefBio] = useState("");
  const [placeWork, setPlaceWork] = useState("");

  const [contactDetailsError, setContactDetailsError] = useState(null);
  const [briefBioError, setBriefBioError] = useState(null);
  const [placeWorkError, setPlaceWorkError] = useState(null);

  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [linkedinUrlError, setLinkedinUrlError] = useState(null);

  const [facebookUrl, setFacebookUrl] = useState("");
  const [facebookUrlError, setFacebookUrlError] = useState(null);

  const [twitterUrl, setTwitterUrl] = useState("");
  const [twitterUrlError, setTwitterUrlError] = useState(null);

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
    setPhone(resUserToState.phone);
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
    setTwitterUrl(resUserToState.twitterUrl);
    setBriefBio(resUserToState.briefBio);
    setContactDetails(resUserToState.contactDetails);
    setTwoFactorAuthentication(resUserToState.twoFactorAuthentication);
    setActive(resUserToState.active);
    setSuspicious(resUserToState.suspicious);
    setVerified(resUserToState.verified);
    setPlaceWork(resUserToState.placeWork);
  }, [user]);

  const getObjectToSave = () => ({
    name,
    role,
    email,
    phone,
    verified,
    emailVerified,
    phoneVerified,
    contactDetails,
    briefBio,
    linkedinUrl,
    facebookUrl,
    twitterUrl,
    instagramUrl,
    twoFactorAuthentication,
    active,
    suspicious,
    placeWork,
  });

  const userToState = (user) => ({
    name: user.name ?? "",
    role: user.role ?? "",
    phone: user.phone ?? "",
    email: user.email ?? "",
    linkedinUrl: user.linkedinUrl ?? "",
    facebookUrl: user.facebookUrl ?? "",
    twitterUrl: user.twitterUrl ?? "",
    instagramUrl: user.instagramUrl ?? "",
    emailVerified: user.emailVerified ?? false,
    phoneVerified: user.phoneVerified ?? false,
    twoFactorAuthentication: user.twoFactorAuthentication ?? true,
    contactDetails: user.contactDetails ?? "",
    briefBio: user.briefBio ?? "",
    active: user.active ?? false,
    suspicious: user.suspicious ?? false,
    verified: user.verified ?? false,
    placeWork: user.placeWork ?? "",
  });

  const hasChanges = () => {
    if (newPhoto) return true;

    const dataToSave = getObjectToSave();
    const userToCheck = userToState(user);

    return !lodash.isEqual(userToCheck, dataToSave);
  };

  const handlePhotoChange = (e) => {
    const img = e.target.files[0];
    const url = URL.createObjectURL(img);

    setNewPhoto(img);
    setPhotoUrl(url);
  };

  const handleCloseAccessLeaveModal = () => {
    setAccessLeaveModalOpen(false);
  };

  const handleClickAccessLeaveModal = () => {
    setAccessLeaveModalOpen(false);
    Router.push("/admin/users");
  };

  const handleGoBackClick = (e) => {
    if (!hasChanges()) {
      Router.push("/admin/users");
      return;
    }

    e.stopPropagation();
    setAccessLeaveModalOpen(true);
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

    if (name.length < 1) {
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

    const resValidatePhone = validatePhoneNumber(phone);

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

    const resValidateTwitterLink = validateUrl(twitterUrl);

    if (twitterUrl && resValidateTwitterLink !== true) {
      setTwitterUrlError(resValidateTwitterLink);
      hasError = true;
    }

    const resBriefBioValidation = validateBigText(briefBio);

    if (resBriefBioValidation !== true) {
      setBriefBioError(resBriefBioValidation);
      hasError = true;
    }

    const resContactDetailsValidation = validateBigText(contactDetails);

    if (resContactDetailsValidation !== true) {
      setContactDetailsError(resContactDetailsValidation);
      hasError = true;
    }

    const resPlaceWorkValidation = validateBigText(placeWork);

    if (resPlaceWorkValidation !== true) {
      setPlaceWorkError(resPlaceWorkValidation);
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

  const handleChangePhone = (value) => {
    if (value.length < 1) setPhoneVerified(false);
    setPhone(value);
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
                <div className="grow">
                  <div className="p-6 space-y-6">
                    <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5">
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
                      <div className="text-sm">
                        Excepteur sint occaecat cupidatat non proident, sunt in
                        culpa qui officia deserunt mollit.
                      </div>
                      <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                        <div className="sm:w-1/4">
                          <Input
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
                          <Input
                            value={phone}
                            setValue={handleChangePhone}
                            setError={setPhoneError}
                            label="Business Phone"
                            labelClassName="sr-only"
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
                        Share your story: LinkedIn, Facebook, Instagram, Twitter
                        links welcome
                      </div>

                      <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                        <div className="sm:w-1/4">
                          <Input
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
                            value={linkedinUrl}
                            setValue={setLinkedinUrl}
                            error={linkedinUrlError}
                            setError={setLinkedinUrlError}
                            label="LinkedIn URL"
                            labelClassName="block text-sm font-medium mb-1"
                          />
                        </div>
                      </div>

                      <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                        <div className="sm:w-1/4">
                          <Input
                            value={instagramUrl}
                            setValue={setInstagramUrl}
                            error={instagramUrlError}
                            setError={setInstagramUrlError}
                            label="Instagram URL"
                            labelClassName="block text-sm font-medium mb-1"
                          />
                        </div>
                        <div className="sm:w-1/4">
                          <Input
                            value={twitterUrl}
                            setValue={setTwitterUrl}
                            error={twitterUrlError}
                            setError={setTwitterUrlError}
                            label="Twitter URL"
                            labelClassName="block text-sm font-medium mb-1"
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
                          value={briefBio}
                          setValue={setBriefBio}
                          error={briefBioError}
                          setError={setBriefBioError}
                        />
                      </div>
                    </section>

                    <section>
                      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                        Contact Details
                      </h2>

                      <div className="text-sm">
                        Enter your information below
                      </div>

                      <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                        <Textarea
                          row="3"
                          value={contactDetails}
                          setValue={setContactDetails}
                          error={contactDetailsError}
                          setError={setContactDetailsError}
                        />
                      </div>
                    </section>

                    <section>
                      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                        Place Work
                      </h2>

                      <div className="text-sm">
                        Determine workplace location.
                      </div>

                      <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                        <Textarea
                          value={placeWork}
                          setValue={setPlaceWork}
                          row="3"
                          error={placeWorkError}
                          setError={setPlaceWorkError}
                        />
                      </div>
                    </section>
                  </div>

                  <footer>
                    <div className="flex flex-col px-6 py-5 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex self-end">
                        <button
                          type="button"
                          onClick={handleGoBackClick}
                          aria-controls="access-leave-modal"
                          className="btn dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
                        >
                          Cancel
                        </button>
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

        <ModalBlank
          id="access-leave-modal"
          modalOpen={accessLeaveModalOpen}
          setModalOpen={setAccessLeaveModalOpen}
        >
          <div className="p-5 flex space-x-4">
            {/* Icon */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-rose-100 dark:bg-rose-500/30">
              <svg
                className="w-4 h-4 shrink-0 fill-current text-rose-500"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
              </svg>
            </div>
            {/* Content */}
            <div>
              {/* Modal header */}
              <div className="mb-2">
                <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  Leave without saving?
                </div>
              </div>
              {/* Modal content */}
              <div className="text-sm mb-10">
                <div className="space-y-2">
                  <p>
                    Are you sure you want to leave this page without saving your
                    changes?
                  </p>
                </div>
              </div>
              {/* Modal footer */}
              <div className="flex flex-wrap justify-end space-x-2">
                <button
                  className="btn-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseAccessLeaveModal();
                  }}
                >
                  Stay and Save
                </button>
                <button
                  onClick={handleClickAccessLeaveModal}
                  className="btn-sm bg-rose-500 hover:bg-rose-600 text-white"
                >
                  Yes, Leave it
                </button>
              </div>
            </div>
          </div>
        </ModalBlank>
      </div>
    </div>
  );
};

export default EditUserForm;
