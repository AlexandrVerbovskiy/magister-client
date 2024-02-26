import ImageInput from "../DashboardComponents/ImageInput";
import Input from "../DashboardComponents/Input";
import Textarea from "../DashboardComponents/Textarea";
import ErrorSpan from "../../components/ErrorSpan";

const ProfileSection = ({ formInfo }) => {
  const {
    photoUrl,
    handlePhotoChange,
    name,
    setName,
    nameError,
    setNameError,
    user,
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
  } = formInfo;

  return (
    <div className="my-profile-box">
      <h3>Profile Details</h3>

      <form method="get">
        <div className="row">
          <div className="col-lg-12 col-md-12">
            <ImageInput photoUrl={photoUrl} onChange={handlePhotoChange} />
          </div>

          <div className="col-lg-6 col-md-12">
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
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={user.email}
                readOnly={true}
              />
            </div>
          </div>

          <div className="row pe-0 edit-profile-phone-row">
            <div className="order-1 order-xl-1 col-xl-6 col-lg-12 col-md-12 p-0 phone-input">
              <Input
                label="Phone"
                value={phone}
                type="text"
                setValue={setPhone}
                setError={setPhoneError}
              />
            </div>

            {(phone != user.phone || !user.phoneVerified) && (
              <div className="order-3 order-xl-2 col-xl-6 col-lg-12 col-md-12 p-0 phone-verify">
                <div className="form-group">
                  <label
                    className="d-none d-xl-block"
                    style={{ color: "transparent" }}
                  >
                    Verify Phone
                  </label>
                  <button type="button" onClick={handleVerifyPhoneClick}>
                    Verify Phone
                  </button>
                </div>
              </div>
            )}

            <ErrorSpan
              error={phoneError}
              className="order-2 order-xl-3 d-block profile-phone-error"
            />
          </div>

          <div className="col-lg-12 col-md-12">
            <Textarea
              label="Bio"
              rows="6"
              placeholder="Short description about you..."
              value={briefBio}
              setValue={setBriefBio}
              error={briefBioError}
              setError={setBriefBioError}
            />
          </div>

          <div className="col-lg-12 col-md-12">
            <Textarea
              label="Contact Details"
              rows="3"
              placeholder="Short contact info about you..."
              value={contactDetails}
              setValue={setContactDetails}
              error={contactDetailsError}
              setError={setContactDetailsError}
            />
          </div>

          <div className="col-lg-12 col-md-12">
            <Textarea
              label="Place Work"
              rows="3"
              placeholder="Short info about you work..."
              value={placeWork}
              setValue={setPlaceWork}
              error={placeWorkError}
              setError={setPlaceWorkError}
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
  );
};

export default ProfileSection;
