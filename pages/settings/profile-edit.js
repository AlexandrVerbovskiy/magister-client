import React, { useState, useContext, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { IndiceContext } from "../../contexts";
import NavbarThree from "../../components/_App/NavbarThree";
import DashboardNavbar from "../../components/Dashboard/DashboardNavbar";
import lodash from "lodash";
import { updateProfile, updateMyPassword } from "../../services";
import ENV from "../../env";
import ImageInput from "../../components/DashboardComponents/ImageInput";
import Input from "../../components/DashboardComponents/Input";
import Textarea from "../../components/DashboardComponents/Textarea";
import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateUrl,
} from "../../utils";

const defaultPhotoLink = "/images/admin/user-avatar-80.png";

const ProfileEdit = () => {
  const router = useRouter();
  const [profileFormError, setProfileFormError] = useState(null);
  const [passwordFormError, setPasswordFormError] = useState(null);

  const { success, setLoading, error, user } = useContext(IndiceContext);

  const [newPhoto, setNewPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);

  const [contactDetails, setContactDetails] = useState("");
  const [briefBio, setBriefBio] = useState("");
  const [placeWork, setPlaceWork] = useState("");

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
    name,
    email,
    phone,
    facebookUrl,
    linkedinUrl,
    instagramUrl,
    twitterUrl,
    briefBio,
    contactDetails,
    placeWork,
  });

  const userToState = () => ({
    name: user.name ?? "",
    email: user.email ?? "",
    phone: user.phone ?? "",
    facebookUrl: user.facebookUrl ?? "",
    linkedinUrl: user.linkedinUrl ?? "",
    instagramUrl: user.instagramUrl ?? "",
    twitterUrl: user.twitterUrl ?? "",
    briefBio: user.briefBio ?? "",
    contactDetails: user.contactDetails ?? "",
    placeWork: user.placeWork ?? "",
  });

  const hasChanges = () => {
    if (newPhoto) return true;

    const dataToSave = objectToSave();

    const userToCheck = {
      ...userToState(),
    };

    return !lodash.isEqual(userToCheck, dataToSave);
  };

  const initUser = () => {
    const userPhoto = user.photo;

    if (userPhoto) {
      setPhotoUrl(ENV.SERVER_STORAGE_URL + "/" + userPhoto);
    } else {
      setPhotoUrl(null);
    }

    const userInfo = userToState();

    setName(userInfo.name);
    setEmail(userInfo.email);
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

    if (name.length < 1) {
      setNameError("Required field");
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

    if (hasError) return;

    if (hasChanges()) {
      const formData = new FormData();

      if (newPhoto) {
        formData.append("photo", newPhoto);
      }

      const info = objectToSave();

      Object.keys(info).forEach((key) => formData.append(key, info[key]));

      try {
        const res = await updateProfile(formData);
        success.set("Saved successfully");

        if (res.photo) {
          setNewPhoto(null);
          setPhotoUrl(ENV.SERVER_STORAGE_URL + "/" + res.photo);
        }
      } catch (e) {
        setProfileFormError(e.message);
      }
    } else {
      success.set("Profile updated successfully");
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
      await updateMyPassword(currentPassword, password);
      success.set("Password updated successfully");
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
    } catch (e) {
      setPasswordFormError(e.message);
    }
  };

  useEffect(() => {
    initUser();
    setLoading(false);
  }, []);

  return (
    <>
      <DashboardNavbar />
      <div className="main-content d-flex flex-column">
        <NavbarThree />

        <div className="breadcrumb-area">
          <h1>Profile Edit</h1>
        </div>

        <div className="row">
          <div className="col-lg-6 col-md-12">
            <div className="my-profile-box">
              <h3>Profile Details</h3>

              <form method="get">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <ImageInput
                      photoUrl={photoUrl}
                      onChange={handlePhotoChange}
                    />
                  </div>

                  <div className="col-lg-12 col-md-12">
                    <Input
                      label="Your Name"
                      value={name}
                      type="text"
                      setValue={setName}
                      error={nameError}
                      setError={setNameError}
                    />
                  </div>

                  <div className="col-xl-6 col-lg-12 col-md-12">
                    <Input
                      label="Email"
                      value={email}
                      type="email"
                      setValue={setEmail}
                      error={emailError}
                      setError={setEmailError}
                    />
                  </div>

                  <div className="col-xl-6 col-lg-12 col-md-12">
                    <Input
                      label="Phone"
                      value={phone}
                      type="text"
                      setValue={setPhone}
                      error={phoneError}
                      setError={setPhoneError}
                    />
                  </div>

                  <div className="col-lg-12 col-md-12">
                    <Textarea
                      label="Bio"
                      rows="6"
                      placeholder="Short description about you..."
                      value={briefBio}
                      setValue={setBriefBio}
                    />
                  </div>

                  <div className="col-lg-12 col-md-12">
                    <Textarea
                      label="Contact Details"
                      rows="3"
                      placeholder="Short contact info about you..."
                      value={contactDetails}
                      setValue={setContactDetails}
                    />
                  </div>

                  <div className="col-lg-12 col-md-12">
                    <Textarea
                      label="Place Work"
                      rows="3"
                      placeholder="Short info about you work..."
                      value={placeWork}
                      setValue={setPlaceWork}
                    />
                  </div>

                  <div className="col-xl-6 col-lg-12 col-md-12">
                    <Input
                      label="Facebook URL"
                      value={facebookUrl}
                      type="text"
                      setValue={setFacebookUrl}
                      placeholder="https://www.facebook.com/"
                      error={facebookUrlError}
                      setError={setFacebookUrlError}
                    />
                  </div>

                  <div className="col-xl-6 col-lg-12 col-md-12">
                    <Input
                      label="Twitter URL"
                      value={twitterUrl}
                      type="text"
                      setValue={setTwitterUrl}
                      placeholder="https://twitter.com/"
                      error={twitterUrlError}
                      setError={setTwitterUrlError}
                    />
                  </div>

                  <div className="col-xl-6 col-lg-12 col-md-12">
                    <Input
                      label="Linkedin URL"
                      value={linkedinUrl}
                      type="text"
                      setValue={setLinkedinUrl}
                      placeholder="https://www.linkedin.com/"
                      error={linkedinUrlError}
                      setError={setLinkedinUrlError}
                    />
                  </div>

                  <div className="col-xl-6 col-lg-12 col-md-12">
                    <Input
                      label="Instagram URL"
                      value={instagramUrl}
                      type="text"
                      setValue={setInstagramUrl}
                      placeholder="https://instagram.com/"
                      error={instagramUrlError}
                      setError={setInstagramUrlError}
                    />
                  </div>

                  {profileFormError && (
                    <div className="col-lg-12 col-md-12">
                      <div
                        className="alert-dismissible fade show alert alert-danger"
                        role="alert"
                      >
                        {profileFormError}
                      </div>
                    </div>
                  )}

                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <button type="button" onClick={handleProfileSaveClick}>
                        Save Change
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="col-lg-6 col-md-12">
            <div className="my-profile-box">
              <h3>Change Password</h3>

              <form method="get">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <Input
                      label="Current Password"
                      value={currentPassword}
                      type="password"
                      setValue={setCurrentPassword}
                      error={currentPasswordError}
                      setError={setCurrentPasswordError}
                    />
                  </div>

                  <div className="col-lg-12 col-md-12">
                    <Input
                      label="New Password"
                      value={password}
                      type="password"
                      setValue={setPassword}
                      error={passwordError}
                      setError={setPasswordError}
                    />
                  </div>

                  <div className="col-lg-12 col-md-12">
                    <Input
                      label="Confirm New Password"
                      value={confirmPassword}
                      type="password"
                      setValue={setConfirmPassword}
                      error={confirmPasswordError}
                      setError={setConfirmPasswordError}
                    />
                  </div>

                  {passwordFormError && (
                    <div className="col-lg-12 col-md-12">
                      <div
                        className="alert-dismissible fade show alert alert-danger"
                        role="alert"
                      >
                        {passwordFormError}
                      </div>
                    </div>
                  )}

                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <button type="button" onClick={handleChangePassword}>
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

ProfileEdit.getInitialProps = async () => ({
  access: "auth",
});

export default ProfileEdit;
