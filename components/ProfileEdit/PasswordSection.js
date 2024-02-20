import Input from "../DashboardComponents/Input";

const PasswordSection = ({ formInfo }) => {
  const {
    currentPassword,
    currentPasswordType,
    setCurrentPassword,
    currentPasswordError,
    setCurrentPasswordError,
    handleChangeCurrentPasswordType,
    password,
    passwordType,
    setPassword,
    passwordError,
    setPasswordError,
    handleChangePasswordType,
    confirmPassword,
    confirmPasswordType,
    setConfirmPassword,
    confirmPasswordError,
    setConfirmPasswordError,
    handleChangeConfirmPasswordType,
    passwordFormError,
    handleChangePassword,
  } = formInfo;

  return (
    <div className="my-profile-box change-password">
      <h3>Change Password</h3>

      <form method="get">
        <div className="row">
          <div className="col-lg-12 col-md-12">
            <Input
              label="Current Password"
              value={currentPassword}
              type={currentPasswordType}
              setValue={setCurrentPassword}
              error={currentPasswordError}
              setError={setCurrentPasswordError}
            >
              <i
                className={`bx ${
                  currentPasswordType == "password" ? "bx-lock" : "bx-lock-open"
                } cursor-pointer`}
                onClick={handleChangeCurrentPasswordType}
              ></i>
            </Input>
          </div>

          <div className="col-lg-12 col-md-12">
            <Input
              label="New Password"
              value={password}
              type={passwordType}
              setValue={setPassword}
              error={passwordError}
              setError={setPasswordError}
            >
              <i
                className={`bx ${
                  passwordType == "password" ? "bx-lock" : "bx-lock-open"
                } cursor-pointer`}
                onClick={handleChangePasswordType}
              ></i>
            </Input>
          </div>

          <div className="col-lg-12 col-md-12">
            <Input
              label="Confirm New Password"
              value={confirmPassword}
              type={confirmPasswordType}
              setValue={setConfirmPassword}
              error={confirmPasswordError}
              setError={setConfirmPasswordError}
            >
              <i
                className={`bx ${
                  confirmPasswordType == "password" ? "bx-lock" : "bx-lock-open"
                } cursor-pointer`}
                onClick={handleChangeConfirmPasswordType}
              ></i>
            </Input>
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
  );
};

export default PasswordSection;
