import React, { useState, useContext, useEffect } from "react";
import { IndiceContext } from "../../contexts";
import NavbarThree from "../../components/_App/NavbarThree";
import DashboardNavbar from "../../components/Dashboard/DashboardNavbar";
import lodash from "lodash";
import {
  updateProfile,
  updateMyPassword,
  checkMyPhoneVerifyCode,
  generateMyPhoneVerifyCode,
  changeTwoFactorAuth,
  noNeedRegularViewInfoForm,
  getUserProfileEditPageOptions,
} from "../../services";
import {
  getFilePath,
  validateSmallText,
  validateBigText,
  validatePassword,
  validatePhoneNumber,
  validateUrl,
} from "../../utils";
import YesNoModal from "../../components/_App/YesNoModal";
import BaseModal from "../../components/_App/BaseModal";
import Link from "next/link";
import { authSideProps } from "../../middlewares";
import {
  PasswordSection,
  ProfileSection,
  SecuritySection,
  DocumentVerificationSection,
  PaypalSection,
} from "../../components/ProfileEdit";
import { useRouter } from "next/router";

const ProfileEdit = ({ newPaypalId }) => {
  const router = useRouter();
  const [profileFormError, setProfileFormError] = useState(null);
  const [passwordFormError, setPasswordFormError] = useState(null);

  const {
    error: mainError,
    success,
    setLoading,
    updateUserFields,
    sessionUser,
    authToken,
  } = useContext(IndiceContext);

  useEffect(() => {
    if (newPaypalId) {
      updateUserFields({ paypalId: newPaypalId });
    }

    router.replace("/dashboard/profile-edit/");
  }, []);

  const [activeVerifyPhoneModal, setActiveVerifyPhoneModal] = useState(false);
  const toggleVerifyPhoneModal = () =>
    setActiveVerifyPhoneModal(!activeVerifyPhoneModal);

  const [activeCodePhoneModal, setActiveCodePhoneModal] = useState(false);
  const [verifyFormError, setVerifyFormError] = useState(null);
  const [phoneCode, setPhoneCode] = useState("");

  const toggleCodePhoneModal = () => {
    setVerifyFormError(null);
    setActiveCodePhoneModal(!activeCodePhoneModal);
  };

  const handleInputPhoneCode = (e) => {
    setVerifyFormError(null);
    setPhoneCode(e.target.value);
  };

  const [newPhoto, setNewPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [nameError, setNameError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);

  const [contactDetails, setContactDetails] = useState("");
  const [briefBio, setBriefBio] = useState("");
  const [placeWork, setPlaceWork] = useState("");

  const [contactDetailsError, setContactDetailsError] = useState(null);
  const [briefBioError, setBriefBioError] = useState(null);
  const [placeWorkError, setPlaceWorkError] = useState(null);

  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");

  const [linkedinUrlError, setLinkedinUrlError] = useState(null);
  const [facebookUrlError, setFacebookUrlError] = useState(null);
  const [twitterUrlError, setTwitterUrlError] = useState(null);
  const [instagramUrlError, setInstagramUrlError] = useState(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const [currentPasswordError, setCurrentPasswordError] = useState(null);

  const objectToSave = () => ({
    name: name.trim(),
    phone: phone.trim(),
    facebookUrl: facebookUrl.trim(),
    linkedinUrl: linkedinUrl.trim(),
    instagramUrl: instagramUrl.trim(),
    twitterUrl: twitterUrl.trim(),
    briefBio: briefBio.trim(),
    contactDetails: contactDetails.trim(),
    placeWork: placeWork.trim(),
  });

  const userToState = () => ({
    name: sessionUser?.name ?? "",
    phone: sessionUser?.phone ?? "",
    facebookUrl: sessionUser?.facebookUrl ?? "",
    linkedinUrl: sessionUser?.linkedinUrl ?? "",
    instagramUrl: sessionUser?.instagramUrl ?? "",
    twitterUrl: sessionUser?.twitterUrl ?? "",
    briefBio: sessionUser?.briefBio ?? "",
    contactDetails: sessionUser?.contactDetails ?? "",
    placeWork: sessionUser?.placeWork ?? "",
  });

  const hasChanges = () => {
    if (newPhoto) return true;
    const dataToSave = objectToSave();
    const userToCheck = userToState();
    return !lodash.isEqual(userToCheck, dataToSave);
  };

  const initUser = () => {
    const userPhoto = sessionUser?.photo;

    if (userPhoto) {
      setPhotoUrl(getFilePath(userPhoto));
    } else {
      setPhotoUrl(null);
    }

    const userInfo = userToState();

    setName(userInfo.name);
    setPhone(userInfo.phone);
    setFacebookUrl(userInfo.facebookUrl);
    setLinkedinUrl(userInfo.linkedinUrl);
    setInstagramUrl(userInfo.instagramUrl);
    setTwitterUrl(userInfo.twitterUrl);
    setBriefBio(userInfo.briefBio);
    setContactDetails(userInfo.contactDetails);
    setPlaceWork(userInfo.placeWork);
  };

  const handlePhotoChange = (e) => {
    const img = e.target.files[0];
    const url = URL.createObjectURL(img);
    setNewPhoto(img);
    setPhotoUrl(url);
  };

  const handleProfileSaveClick = async () => {
    setProfileFormError(null);

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

    if (hasError) return false;

    if (hasChanges()) {
      const formData = new FormData();

      if (newPhoto) {
        formData.append("photo", newPhoto);
      }

      const info = objectToSave();

      Object.keys(info).forEach((key) => formData.append(key, info[key]));

      try {
        const res = await updateProfile(formData, authToken);
        success.set("Profile updated successfully");

        const newData = { ...info };

        if (info.phone != (sessionUser?.phone ?? "")) {
          newData["photoVerified"] = false;
        }

        if (res.photo) {
          setNewPhoto(null);
          newData["photo"] = res.photo;
          setPhotoUrl(getFilePath(res.photo));
        }

        updateUserFields(newData);

        return true;
      } catch (e) {
        setProfileFormError(e.message);
        return false;
      }
    } else {
      success.set("Profile updated successfully");
      return true;
    }
  };

  const handleChangePassword = async () => {
    setPasswordFormError(null);

    let hasError = false;

    const resValidateCurrentPass = validatePassword(currentPassword);
    const resValidateNewPass = validatePassword(password);
    const resValidateNewConfirmPass = validatePassword(confirmPassword);

    if (resValidateNewConfirmPass !== true) {
      setConfirmPasswordError(resValidateNewConfirmPass);
      hasError = true;
    }

    if (resValidateNewPass !== true) {
      setPasswordError(resValidateNewPass);
      hasError = true;
    }

    if (resValidateCurrentPass !== true) {
      setCurrentPasswordError(resValidateCurrentPass);
      hasError = true;
    }

    if (password != confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      hasError = true;
    }

    if (password == confirmPassword && password == currentPassword) {
      setPasswordError("New password can't be equal with current password");
      hasError = true;
    }

    if (hasError) return;

    try {
      await updateMyPassword(currentPassword, password, authToken);
      success.set("Password updated successfully");
    } catch (e) {
      setPasswordFormError(e.message);
    } finally {
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
    }
  };

  const handleVerifyPhoneModalClick = async () => {
    const success = await handleProfileSaveClick();

    if (!success) {
      toggleVerifyPhoneModal();
      return;
    }

    try {
      await generateMyPhoneVerifyCode(authToken);
      toggleCodePhoneModal();
    } catch (e) {
      setProfileFormError(e.message);
      toggleVerifyPhoneModal();
    }
  };

  const handleVerifyPhoneClick = async () => {
    const userInfo = userToState();

    if (userInfo.phone == phone && sessionUser?.phoneVerified) return;

    const resPhoneValidate = validatePhoneNumber(phone);

    if (resPhoneValidate !== true) {
      setPhoneError(resPhoneValidate);
      return;
    }

    if (userInfo.phone != phone) {
      toggleVerifyPhoneModal();
    } else {
      try {
        await generateMyPhoneVerifyCode(authToken);
        toggleCodePhoneModal();
      } catch (e) {
        setProfileFormError(e.message);
      }
    }
  };

  const handleVerifyCode = async () => {
    if (phoneCode.trim().length < 1) {
      setVerifyFormError("Code is required field");
      return;
    }

    try {
      await checkMyPhoneVerifyCode(phoneCode, authToken);
      toggleCodePhoneModal();
      updateUserFields({ phoneVerified: true });
      success.set("Phone success verified");
    } catch (e) {
      setVerifyFormError(e.message);
    }
  };

  const handleTwoFactorAuthChange = async (e) => {
    try {
      const res = await changeTwoFactorAuth(authToken);
      success.set(res.message);
      updateUserFields({
        twoFactorAuthentication: res.body.twoFactorAuthentication,
      });
    } catch (e) {
      mainError.set(e.message);
    }
  };

  useEffect(() => {
    if (!sessionUser) return;

    initUser();
    setLoading(false);
  }, [sessionUser]);

  if (!sessionUser) return <></>;

  const profileFormSection = (
    <ProfileSection
      formInfo={{
        photoUrl,
        handlePhotoChange,
        name,
        setName,
        nameError,
        setNameError,
        user: sessionUser,
        phone,
        setPhone,
        setPhoneError,
        handleVerifyPhoneClick,
        phoneError,
        briefBio,
        setBriefBio,
        contactDetails,
        setContactDetails,
        placeWork,
        setPlaceWork,
        facebookUrl,
        setFacebookUrl,
        facebookUrlError,
        setFacebookUrlError,
        twitterUrl,
        setTwitterUrl,
        twitterUrlError,
        setTwitterUrlError,
        linkedinUrl,
        setLinkedinUrl,
        linkedinUrlError,
        setLinkedinUrlError,
        instagramUrl,
        setInstagramUrl,
        instagramUrlError,
        setInstagramUrlError,
        profileFormError,
        handleProfileSaveClick,
        contactDetailsError,
        setContactDetailsError,
        briefBioError,
        setBriefBioError,
        placeWorkError,
        setPlaceWorkError,
      }}
    />
  );

  const passwordFormSection = (
    <PasswordSection
      formInfo={{
        currentPassword,
        setCurrentPassword,
        currentPasswordError,
        setCurrentPasswordError,
        password,
        setPassword,
        passwordError,
        setPasswordError,
        confirmPassword,
        setConfirmPassword,
        confirmPasswordError,
        setConfirmPasswordError,
        passwordFormError,
        handleChangePassword,
      }}
    />
  );

  const paypalFormSection = <PaypalSection />;

  const securityFormSection = (
    <SecuritySection
      formInfo={{ handleTwoFactorAuthChange, user: sessionUser }}
    />
  );

  const verifyDocumentsSection = <DocumentVerificationSection />;

  return (
    <>
      <YesNoModal
        title="Confirm Action"
        body="To confirm the phone number, you need to save the data
        entered in the form. Are you sure you want to leave the data
        as is?"
        active={activeVerifyPhoneModal}
        closeModal={toggleVerifyPhoneModal}
        onAccept={handleVerifyPhoneModalClick}
      />

      <BaseModal
        active={activeCodePhoneModal}
        closeModal={toggleCodePhoneModal}
      >
        <span className="sub-title mb-0">
          <span>Enter Verified Code</span>
        </span>

        <form className="mt-0" method="get">
          <span className="small-text">
            You received a verification code on your mobile phone. Copy and
            paste it in the field below
          </span>
          <div className="form-group mt-2">
            <input
              value={phoneCode}
              onInput={handleInputPhoneCode}
              type="text"
              placeholder="Code"
              name="phoneCode"
              className="form-control"
            />
          </div>
          {verifyFormError && (
            <div className="col-12">
              <div
                className="alert-dismissible fade show alert alert-danger"
                role="alert"
              >
                {verifyFormError}
              </div>
            </div>
          )}
          <button type="button" onClick={handleVerifyCode}>
            Verify
          </button>
        </form>
      </BaseModal>

      <DashboardNavbar />
      <div className="main-content d-flex flex-column">
        <NavbarThree />

        <div className="breadcrumb-area">
          <h1>Profile</h1>
          <ol className="breadcrumb">
            <li className="item">
              <Link href="/">Home</Link>
            </li>
            <li className="item">
              <Link href="/dashboard/">Dashboard</Link>
            </li>
            <li className="item">Profile</li>
          </ol>
        </div>

        <div className="row">
          <div className="col-lg-6 col-md-12">{profileFormSection}</div>

          <div className="col-lg-6 col-md-12">
            {sessionUser?.hasPasswordAccess && (
              <>
                {securityFormSection}
                {passwordFormSection}
              </>
            )}
            {paypalFormSection}
            {verifyDocumentsSection}
          </div>
        </div>
      </div>
    </>
  );
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const paypalCode = context.query["code"] ?? null;

  if (baseSideProps.sessionUser?.needRegularViewInfoForm) {
    noNeedRegularViewInfoForm(baseSideProps.authToken);
  }

  const options = await getUserProfileEditPageOptions(
    paypalCode,
    baseSideProps.authToken
  );
  return { ...options };
};

export const getServerSideProps = (context) =>
  authSideProps(context, boostServerSideProps);

export default ProfileEdit;
