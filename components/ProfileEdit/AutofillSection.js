import { useContext, useState } from "react";
import { IndiceContext } from "../../contexts";
import Input from "../DashboardComponents/Input";
import { validateInteger } from "../../utils";
import { autofillSaveUserData } from "../../services";

const AutofillSection = () => {
  const { updateUserFields, sessionUser, authToken, success, error } =
    useContext(IndiceContext);

  const [loading, setLoading] = useState(false);
  const [paypalId, setPaypalId] = useState(sessionUser.paypalId ?? "");
  const [paypalIdError, setPaypalIdError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) {
      return;
    }

    let hasError = false;

    const resPaypalIdValidation = validateInteger(paypalId);

    if (resPaypalIdValidation !== true) {
      setPaypalIdError(resPaypalIdValidation);
    }

    if (hasError) {
      return;
    }

    try {
      setLoading(true);
      if (isChangedInfo()) {
        await autofillSaveUserData({ paypalId }, authToken);
        updateUserFields({ paypalId });
      }

      success.set("Autofill data saved successfully");
    } catch (err) {
      error.set(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-profile-box">
      <h3>Autofill Data</h3>

      <div className="row">
        <div className="col-lg-12 col-md-12">
          <form method="get" onSubmit={handleSubmit}>
            <div className="col-lg-12 col-md-12 left-input-icon">
              <Input
                label="Paypal Id"
                type="text"
                setValue={setPaypalId}
                error={paypalIdError}
                setError={setPaypalIdError}
                name="paypal-id"
                value={paypalId}
              />
            </div>

            <div className="form-group">
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AutofillSection;
