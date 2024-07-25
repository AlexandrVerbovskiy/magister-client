import Input from "../DashboardComponents/Input";
import PasswordInput from "../FormComponents/PasswordInput";

const PasswordSection = ({ formInfo }) => {
  const {
    currentPassword,
    currentPasswordType,
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
  } = formInfo;

  return (
    <div className="my-profile-box">
      <h3>Change Password</h3>

      <form method="get">
        <div className="row">
          <div className="col-lg-12 col-md-12 left-input-icon">
            <PasswordInput
              label="Current Password"
              name="password"
              value={currentPassword}
              placeholder="Current Password"
              error={currentPasswordError}
              onInput={(e) => {
                setCurrentPasswordError(null);
                setCurrentPassword(e.target.value);
              }}
            />
          </div>

          <div className="col-lg-12 col-md-12 left-input-icon">
            <PasswordInput
              label="New Password"
              name="password"
              value={password}
              placeholder="New Password"
              error={passwordError}
              onInput={(e) => {
                setPasswordError(null);
                setPassword(e.target.value);
              }}
            />
          </div>

          <div className="col-lg-12 col-md-12 left-input-icon">
            <PasswordInput
              label="Confirm New Password"
              name="confirm-new-password"
              value={confirmPassword}
              placeholder="Confirm New Password"
              error={confirmPasswordError}
              onInput={(e) => {
                setConfirmPasswordError(null);
                setConfirmPassword(e.target.value);
              }}
            />
          </div>

          {passwordFormError && (
            <div className="col-12">
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
  );
};

export default PasswordSection;
