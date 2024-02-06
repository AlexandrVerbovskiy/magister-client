import React, { useState, useContext, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { IndiceContext } from "../../contexts";
import NavbarThree from "../../components/_App/NavbarThree";
import DashboardNavbar from "../../components/Dashboard/DashboardNavbar";
import lodash from "lodash";
import { updateProfile, updateMyPassword } from "../../services";
import ENV from "../../env";

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

  const [contactDetails, setContactDetails] = useState("");
  const [briefBio, setBriefBio] = useState("");
  const [placeWork, setPlaceWork] = useState("");

  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

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
                    <div className="form-group profile-box">
                      <img src={photoUrl ?? defaultPhotoLink} alt="image" />
                      <div className="file-upload">
                        <input
                          type="file"
                          name="file"
                          id="file"
                          style={{ display: "none" }}
                          accept="image/*"
                          className="inputfile"
                          onChange={handlePhotoChange}
                        />
                        <label htmlFor="file">
                          <i className="bx bx-upload"></i> Upload Photo
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Your Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={name}
                        onInput={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-xl-6 col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={email}
                        onInput={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-xl-6 col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="text"
                        className="form-control"
                        value={phone}
                        onInput={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Bio</label>
                      <textarea
                        cols="30"
                        rows="6"
                        placeholder="Short description about you..."
                        className="form-control"
                        value={briefBio}
                        onInput={(e) => setBriefBio(e.target.value)}
                      ></textarea>
                    </div>
                  </div>

                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Contact Details</label>
                      <textarea
                        cols="30"
                        rows="3"
                        placeholder="Short contact info about you..."
                        className="form-control"
                        value={contactDetails}
                        onInput={(e) => setContactDetails(e.target.value)}
                      ></textarea>
                    </div>
                  </div>

                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Place Work</label>
                      <textarea
                        cols="30"
                        rows="3"
                        placeholder="Short info about you work..."
                        className="form-control"
                        value={placeWork}
                        onInput={(e) => setPlaceWork(e.target.value)}
                      ></textarea>
                    </div>
                  </div>

                  <div className="col-xl-6 col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Facebook URL</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="https://www.facebook.com/"
                        value={facebookUrl}
                        onInput={(e) => setFacebookUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-xl-6 col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Twitter URL</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="https://twitter.com/"
                        value={twitterUrl}
                        onInput={(e) => setTwitterUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-xl-6 col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Linkedin URL</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="https://www.linkedin.com/"
                        value={linkedinUrl}
                        onInput={(e) => setLinkedinUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-xl-6 col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Instagram URL</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="https://instagram.com/"
                        value={instagramUrl}
                        onInput={(e) => setInstagramUrl(e.target.value)}
                      />
                    </div>
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
                    <div className="form-group">
                      <label>Current Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={currentPassword}
                        onInput={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={password}
                        onInput={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onInput={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
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
