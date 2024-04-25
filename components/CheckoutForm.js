import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createStripePaymentIntent } from "../services";
import { IndiceContext } from "../contexts";
import { useContext } from "react";

const checkoutFormOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
  hidePostalCode: true,
};

const CheckoutForm = ({ success = () => {}, amount }) => {
  const {
    error: mainError,
    success: mainSuccess,
    authToken,
  } = useContext(IndiceContext);

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!error) {
      try {
        const { id } = paymentMethod;

        const res = await createStripePaymentIntent(
          {
            id,
            amount,
          },
          authToken
        );

        console.log(res);
        mainSuccess.set("Created successfully");
        success();
      } catch ({ message, response }) {
        mainError.set(response ? response.data : message);
      }
    } else {
      mainError.set(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <CardElement options={checkoutFormOptions} />
      <button className="square_btn">Pay</button>
      <style global jsx>{`
        .square_btn {
          width: 100%;
          max-width: 150px;
          display: inline-block;
          padding: 0.5em 1em;
          text-decoration: none;
          background: #668ad8; /*Button Color*/
          color: #fff;
          border-bottom: solid 4px #627295;
          border-radius: 3px;
          margin: 20px auto;
        }
        .square_btn:active {
          /*on Click*/
          -ms-transform: translateY(4px);
          -webkit-transform: translateY(4px);
          transform: translateY(4px); /*Move down*/
          border-bottom: none; /*disappears*/
        }
        .checkout-form {
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      `}</style>
    </form>
  );
};

export default CheckoutForm;
