import React, { useState, useEffect, useContext, useRef } from "react";
import Router, { useRouter } from "next/router";
import lodash from "lodash";

import { getUserById, updateUser } from "../../../services";
import { IndiceContext } from "../../../contexts";
import ErrorPage from "next/error";
import Sidebar from "../../../partials/admin/Sidebar";
import Header from "../../../partials/admin/Header";
import BreadCrumbs from "../../../partials/admin/base/BreadCrumbs";
import { useAdminPage } from "../../../hooks";
import ENV from "../../../env";
import Switch from "../../../partials/admin/base/Switch";
import DropdownClassic from "../../../components/admin/DropdownClassic";
import ModalBlank from "../../../components/admin/ModalBlank";

const defaultPhotoLink = "/images/admin/user-avatar-80.png";
const roleOptions = [
  { value: "user", title: "User" },
  { value: "support", title: "Support" },
  { value: "admin", title: "Admin" },
];

const UserEdit = () => {
  const [accessLeaveModalOpen, setAccessLeaveModalOpen] = useState(false);

  const router = useRouter();
  const { id } = router.query;
  const { error, success } = useContext(IndiceContext);
  const { sidebarOpen, setSidebarOpen } = useAdminPage();

  const [user, setUser] = useState(null);

  const [newPhoto, setNewPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const photoInputRef = useRef(null);

  const [name, setName] = useState("");
  const [role, setRole] = useState("user");

  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const [phone, setPhone] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);

  const [contactDetails, setContactDetails] = useState("");
  const [briefBio, setBriefBio] = useState("");
  const [placeWork, setPlaceWork] = useState("");

  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");

  const [twoFactorAuthentication, setTwoFactorAuthentication] = useState(false);
  const [active, setActive] = useState(false);
  const [verified, setVerified] = useState(false);
  const [suspicious, setSuspicious] = useState(false);

  const getObjectToSave = () => ({
    id,
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

    const userToCheck = {
      id,
      ...userToState(user),
    };

    return !lodash.isEqual(userToCheck, dataToSave);
  };

  const initUser = async () => {
    try {
      if (id) {
        const gotUserInfo = await getUserById(id);
        setUser(gotUserInfo);

        if (gotUserInfo && gotUserInfo.id) {
          const userPhoto = gotUserInfo.photo;

          if (userPhoto) {
            setPhotoUrl(ENV.SERVER_STORAGE_URL + "/" + userPhoto);
          } else {
            setPhotoUrl(null);
          }

          const resUserToState = userToState(gotUserInfo);

          setName(resUserToState.name);
          setEmail(resUserToState.email);
          setEmailVerified(resUserToState.emailVerified);
          setPhone(resUserToState.phone);
          setPhoneVerified(resUserToState.phoneVerified);
          setRole(resUserToState.role);
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
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (e) {
      error.set(e.message);
    }
  };

  useEffect(() => {
    initUser();
  }, [id]);

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

  const handlePhotoInputClick = () => photoInputRef.current.click();

  const handleGoBackClick = (e) => {
    if (!hasChanges()) {
      Router.push("/admin/users");
      return;
    }

    e.stopPropagation();
    setAccessLeaveModalOpen(true);
  };

  const handleSaveClick = async () => {
    if (!hasChanges()) {
      success.set("Saved successfully");
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
      const res = await updateUser(formData);
      success.set("Saved successfully");

      if (res.photo) {
        setNewPhoto(null);
        setPhotoUrl(ENV.SERVER_STORAGE_URL + "/" + res.photo);
      }
    } catch (e) {
      error.set(e.message);
    }
  };

  if (!user) {
    return <ErrorPage statusCode={404} />;
  }

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
                  { title: user.name },
                ]}
              />
            </div>

            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-sm mb-8">
              <div className="flex flex-col md:flex-row md:-mr-px">
                <div className="grow">
                  <div className="p-6 space-y-6">
                    <h2 className="text-2xl text-slate-800 dark:text-slate-100 font-bold mb-5">
                      Account {user.name}
                    </h2>

                    <section>
                      <div className="flex items-center">
                        <div className="mr-4">
                          <img
                            className="cursor-pointer w-20 h-20 rounded-full"
                            src={photoUrl ?? defaultPhotoLink}
                            width="80"
                            height="80"
                            alt="User upload"
                            onClick={handlePhotoInputClick}
                          />
                        </div>

                        <button
                          onClick={handlePhotoInputClick}
                          className="btn-sm bg-indigo-500 hover:bg-indigo-600 text-white"
                        >
                          Change
                        </button>

                        <input
                          ref={photoInputRef}
                          style={{ display: "none" }}
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                        />
                      </div>
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
                          <label
                            className="block text-sm font-medium mb-1"
                            htmlFor="name"
                          >
                            User Name
                          </label>
                          <input
                            id="name"
                            className="form-input w-full"
                            type="text"
                            value={name}
                            onInput={(e) => setName(e.target.value)}
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
                          <label className="sr-only" htmlFor="email">
                            Business email
                          </label>
                          <input
                            id="email"
                            className="form-input"
                            type="email"
                            value={email}
                            onInput={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <Switch
                          id="email-toggle"
                          checked={emailVerified}
                          changeChecked={() => setEmailVerified(!emailVerified)}
                          onText="Verified"
                          offText="Not verified"
                        />
                      </div>
                    </section>

                    <section>
                      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                        Phone
                      </h2>
                      <div className="flex flex-wrap mt-2">
                        <div className="mr-2">
                          <label className="sr-only" htmlFor="email">
                            Business Phone
                          </label>
                          <input
                            id="phone"
                            className="form-input"
                            type="phone"
                            value={phone}
                            onInput={(e) => setPhone(e.target.value)}
                          />
                        </div>
                        <Switch
                          id="phone-toggle"
                          checked={phoneVerified}
                          changeChecked={() => setPhoneVerified(!phoneVerified)}
                          onText="Verified"
                          offText="Not verified"
                        />
                      </div>
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
                          <label
                            className="block text-sm font-medium mb-1"
                            htmlFor="facebook_url"
                          >
                            Facebook URL
                          </label>
                          <input
                            id="facebook_url"
                            className="form-input w-full"
                            type="text"
                            value={facebookUrl}
                            onInput={(e) => setFacebookUrl(e.target.value)}
                          />
                        </div>
                        <div className="sm:w-1/4">
                          <label
                            className="block text-sm font-medium mb-1"
                            htmlFor="linkedin_url"
                          >
                            LinkedIn URL
                          </label>
                          <input
                            id="linkedin_url"
                            className="form-input w-full"
                            type="text"
                            value={linkedinUrl}
                            onInput={(e) => setLinkedinUrl(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                        <div className="sm:w-1/4">
                          <label
                            className="block text-sm font-medium mb-1"
                            htmlFor="instagram_url"
                          >
                            Instagram URL
                          </label>
                          <input
                            id="instagram_url"
                            className="form-input w-full"
                            type="text"
                            value={instagramUrl}
                            onInput={(e) => setInstagramUrl(e.target.value)}
                          />
                        </div>
                        <div className="sm:w-1/4">
                          <label
                            className="block text-sm font-medium mb-1"
                            htmlFor="twitter_url"
                          >
                            Twitter URL
                          </label>
                          <input
                            id="twitter_url"
                            className="form-input w-full"
                            type="text"
                            value={twitterUrl}
                            onInput={(e) => setTwitterUrl(e.target.value)}
                          />
                        </div>
                      </div>
                    </section>

                    <section>
                      <h2 className="text-xl leading-snug text-slate-800 dark:text-slate-100 font-bold mb-1">
                        Two Factor Authentication
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
                            htmlFor="active"
                          >
                            Verified by checking the box, unverified by leaving
                            it unchecked.
                          </label>
                        </div>
                        <Switch
                          id="active"
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
                            Enable Two-Factor Authentication for added security.
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
                        Contact Details
                      </h2>

                      <div className="text-sm">
                        Enter your information below
                      </div>

                      <div className="sm:flex sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-5">
                        <textarea
                          className="form-input w-full"
                          type="text"
                          rows="6"
                          value={contactDetails}
                          onInput={(e) => setContactDetails(e.target.value)}
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
                        <textarea
                          className="form-input w-full"
                          type="text"
                          value={briefBio}
                          rows="6"
                          onInput={(e) => setBriefBio(e.target.value)}
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
                        <textarea
                          className="form-input w-full"
                          type="text"
                          value={placeWork}
                          rows="6"
                          onInput={(e) => setPlaceWork(e.target.value)}
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

UserEdit.getInitialProps = async () => ({
  access: "admin",
  type: "admin",
});

export default UserEdit;
