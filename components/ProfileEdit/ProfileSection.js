import ImageInput from "../DashboardComponents/ImageInput";
import Input from "../DashboardComponents/Input";
import Textarea from "../DashboardComponents/Textarea";
import ErrorSpan from "../../components/ErrorSpan";
import PhoneInput from "react-phone-input-2";
import STATIC from "../../static";

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
    phoneCountryCode,
    setPhoneCountryCode,
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
  } = formInfo;

  const handleChangePhone = (newPhone, countryData) => {
    setPhone(newPhone);
    setPhoneCountryCode(countryData.countryCode);
    setPhoneError(null);
  };

  return (
    <div className="my-profile-box">
      <h3>Profile Details</h3>

      <form method="get">
        <div className="row">
          <div className="col-lg-12 col-md-12">
            <ImageInput photoUrl={photoUrl} onChange={handlePhotoChange} />
          </div>

          <div className="col-xl-6 col-lg-12 col-md-12">
            <Input
              label="Your Name"
              value={name}
              type="text"
              setValue={setName}
              error={nameError}
              setError={setNameError}
              name="name"
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
                name="email"
              />
            </div>
          </div>

          <div className="row pe-0 edit-profile-phone-row">
            <div className="order-1 order-xl-1 col-xl-6 col-lg-12 col-md-12 p-0 phone-input">
              <div className="form-group">
                <label>Phone</label>

                <PhoneInput
                  value={phone}
                  onChange={handleChangePhone}
                  onlyCountries={STATIC.PHONE_COUNTRIES_CODES}
                  inputProps={{ name: "phone" }}
                  placeholder="Phone Number"
                />
              </div>
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
              name="bio"
            />
          </div>

          <div className="col-12">
            <Input
              label="Facebook URL"
              value={facebookUrl}
              type="text"
              setValue={setFacebookUrl}
              placeholder="https://www.facebook.com/"
              error={facebookUrlError}
              setError={setFacebookUrlError}
              name="facebookUrl"
            />
          </div>

          <div className="col-12">
            <Input
              label="Linkedin URL"
              value={linkedinUrl}
              type="text"
              setValue={setLinkedinUrl}
              placeholder="https://www.linkedin.com/"
              error={linkedinUrlError}
              setError={setLinkedinUrlError}
              name="linkedinUrl"
            />
          </div>

          <div className="col-12">
            <Input
              label="Instagram URL"
              value={instagramUrl}
              type="text"
              setValue={setInstagramUrl}
              placeholder="https://instagram.com/"
              error={instagramUrlError}
              setError={setInstagramUrlError}
              name="instagramUrl"
            />
          </div>

          {profileFormError && (
            <div className="col-12">
              <div
                className="alert-dismissible fade show alert alert-danger"
                role="alert"
              >
                {profileFormError}
              </div>
            </div>
          )}

          <div className="col-12">
              <button type="button" onClick={handleProfileSaveClick}>
                Save Change
              </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileSection;
