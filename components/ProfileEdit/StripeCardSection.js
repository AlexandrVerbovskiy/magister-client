import { useContext, useState } from "react";
import BaseModal from "../_App/BaseModal";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import env from "../../env";
import { connectNewCreditCard } from "../../services";
import { IndiceContext } from "../../contexts";

const StripeCardSection = ({ active = true }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { authToken } = useContext(IndiceContext);

  const [activePopup, setActivePopup] = useState(false);
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleActivatePopup = () => setActivePopup(true);
  const handleClosePopup = () => setActivePopup(false);

  const handleConnectClick = async (event) => {
    event.preventDefault();

    if (loading) {
      return false;
    }

    try {
      setLoading(true);
      setFormError(null);

      const { paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardNumberElement),
      });

      const cardId = paymentMethod.id;
      await connectNewCreditCard(cardId, authToken);
      setActivePopup(false);
    } catch (e) {
      console.log(e.message);
      setFormError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-profile-box">
      <h3>Card Section</h3>

      <div className="row">
        <div className="col-lg-12 col-md-12">
          <form method="get" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <button
                type="button"
                onClick={handleActivatePopup}
                disabled={!active}
              >
                Connect Credit Card
              </button>
            </div>
          </form>
        </div>
      </div>

      <BaseModal
        active={activePopup}
        toggleActive={handleClosePopup}
        className="stripe-card-append"
        needCloseBtn={true}
      >
        <span className="sub-title mb-2">
          <span>Enter Credit Card Information</span>
        </span>

        <form onSubmit={handleConnectClick}>
          <div className="row">
            <div className="col-12">
              <div className="form-group">
                <label style={{ display: "block" }}>Card Number</label>
                <CardNumberElement />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label style={{ display: "block" }}>Expiration Date</label>
                <CardExpiryElement />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="form-group">
                <label style={{ display: "block" }}>CVC</label>
                <CardCvcElement />
              </div>
            </div>
          </div>

          {formError && (
            <div
              className="alert-dismissible fade show alert alert-danger"
              role="alert"
            >
              {formError}
            </div>
          )}

          <button type="submit">Connect</button>
        </form>
      </BaseModal>
    </div>
  );
};

export default StripeCardSection;
