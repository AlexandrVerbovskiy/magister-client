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
import { parsePhoneNumberFromString } from "libphonenumber-js";
import STATIC from "../../static";
import PhoneVerifiedCodeModal from "../../components/_App/Navbar/PhoneVerifiedCodeModal";

const ProfileEdit = ({ newPaypalId, verifiedInfo }) => {
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
      router.replace("/dashboard/profile-edit/");
      success.set("Paypal id successfully saved");
    }
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
  const [phoneCountryCode, setPhoneCountryCode] = useState("");

  const [nameError, setNameError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);

  const [briefBio, setBriefBio] = useState("");
  const [briefBioError, setBriefBioError] = useState(null);

  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");

  const [linkedinUrlError, setLinkedinUrlError] = useState(null);
  const [facebookUrlError, setFacebookUrlError] = useState(null);
  const [instagramUrlError, setInstagramUrlError] = useState(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const [currentPasswordError, setCurrentPasswordError] = useState(null);

  const objectToSave = () => {
    const obj = {
      name: name.trim(),
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

    return obj;
  };

  const userToState = () => ({
    name: sessionUser?.name ?? "",
    phone: sessionUser?.phone ?? "",
    facebookUrl: sessionUser?.facebookUrl ?? "",
    linkedinUrl: sessionUser?.linkedinUrl ?? "",
    instagramUrl: sessionUser?.instagramUrl ?? "",
    briefBio: sessionUser?.briefBio ?? "",
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
    setFacebookUrl(userInfo.facebookUrl);
    setLinkedinUrl(userInfo.linkedinUrl);
    setInstagramUrl(userInfo.instagramUrl);
    setBriefBio(userInfo.briefBio);

    if (userInfo.phone) {
      const phoneNumber = parsePhoneNumberFromString("+" + userInfo.phone);
      const phoneCountry = phoneNumber?.country;

      if (phoneNumber && phoneCountry) {
        setPhoneCountryCode(phoneCountry.toLocaleLowerCase());
        setPhone(userInfo.phone);
      } else {
        setPhoneCountryCode(STATIC.DEFAULT_PHONE_INFO.code);
        setPhone(STATIC.DEFAULT_PHONE_INFO.phone);
      }
    } else {
      setPhoneCountryCode(STATIC.DEFAULT_PHONE_INFO.code);
      setPhone(STATIC.DEFAULT_PHONE_INFO.phone);
    }
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
          newData["phoneVerified"] = false;
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

    const resPhoneValidate = validatePhoneNumber(phone, phoneCountryCode);

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
        setPhoneError(e.message);
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
        facebookUrl,
        setFacebookUrl,
        facebookUrlError,
        setFacebookUrlError,
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
        briefBioError,
        setBriefBioError,
        phoneCountryCode,
        setPhoneCountryCode,
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

  const verifyDocumentsSection = (
    <DocumentVerificationSection verifiedInfo={verifiedInfo} />
  );

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

      <PhoneVerifiedCodeModal
        activeModal={activeCodePhoneModal}
        closeModal={() => setActiveCodePhoneModal(false)}
        code={phoneCode}
        handleInputCode={handleInputPhoneCode}
        verifyFormError={verifyFormError}
        handleVerifyCode={handleVerifyCode}
      />

      <DashboardNavbar />
      <div className="main-content d-flex flex-column">
        <NavbarThree />

        <div className="miran-grid-sorting row align-items-center d-none d-xl-block">
          <div className="col-12 result-count">
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
          </div>
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

  const options = await getUserProfileEditPageOptions(
    paypalCode,
    baseSideProps.authToken
  );

  return { ...options, pageLoading: true };
};

export const getServerSideProps = (context) =>
  authSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "Profile edit" },
  });

export default ProfileEdit;
