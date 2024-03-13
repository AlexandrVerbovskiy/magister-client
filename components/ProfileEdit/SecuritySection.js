const SecuritySection = ({ formInfo }) => {
  const { handleTwoFactorAuthChange, user } = formInfo;

  return (
    <div className="add-listings-box">
      <h3>Security</h3>

      <div
        className="form-group"
        style={{ marginBottom: 0, paddingBottom: "25px" }}
      >
        <div className="sidebar-widgets">
          <div className="box">
            <span className="title">Two-factor authorization</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={user.twoFactorAuthentication}
                onChange={handleTwoFactorAuthChange}
                name="twoFactorCode"
              />
              <span></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;
