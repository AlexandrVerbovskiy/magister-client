import { useContext, useEffect } from "react";
import { IndiceContext } from "../../contexts";
import ENV from "../../env";
import { generateUpdatePaypalIdLink } from "../../services";

const PaypalSection = () => {
  const { sessionUser } = useContext(IndiceContext);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.paypalobjects.com/js/external/api.js";

    script.onload = () => {
      if (window.paypal) {
        window.paypal.use(["login"], function (login) {
          login.render({
            appid: ENV.PAYPAL_CLIENT_ID,
            authend: "sandbox",
            containerid: "paypal-connect",
            responseType: "code",
            scopes: "https://uri.paypal.com/services/paypalattributes",
            locale: "en-us",
            buttonType: "LWP",
            buttonShape: "pill",
            buttonSize: "lg",
            fullPage: "true",
            returnurl: ENV.CLIENT_URL+"/dashboard/profile-edit",
          });
        });
      }
    };

    document.body.appendChild(script);
  }, []);

  return (
    <div className="my-profile-box">
      <h3 className="edit-profile-document-section-title">
        PayPal Connection{" "}
        {sessionUser?.paypalId ? (
          <i className="bx bx-check-circle icon-success"></i>
        ) : (
          <i className="bx bx-x-circle icon-danger"></i>
        )}
      </h3>

      <form method="get" onSubmit={(e) => e.preventDefault()}>
        <div className="row">
          <div className="col-lg-12 col-md-12">
            <div className="form-group">
              <button
                type="button"
                id="paypal-connect"
                className={
                  sessionUser?.paypalId ? "update-paypal" : "connect-paypal"
                }
              ></button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PaypalSection;
