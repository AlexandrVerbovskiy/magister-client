import { useContext } from "react";
import { IndiceContext } from "../../contexts";
import ENV from "../../env";
import Script from "next/script";

const PaypalSection = () => {
  const { sessionUser } = useContext(IndiceContext);

  const onLoadScript = () => {
    console.log("test");

    if (window.paypal && window.paypal.use) {
      window.paypal.use(["login"], function (login) {
        const loginRenderObj = {
          appid: ENV.PAYPAL_CLIENT_ID,
          containerid: "paypal-connect",
          responseType: "code",
          scopes: "https://uri.paypal.com/services/paypalattributes",
          locale: "en-us",
          buttonType: "LWP",
          buttonShape: "pill",
          buttonSize: "lg",
          fullPage: "true",
          returnurl: ENV.CLIENT_URL + "/dashboard/profile-edit/",
        };

        if (ENV.PAYPAL_TYPE != "production") {
          loginRenderObj["authend"] = ENV.PAYPAL_TYPE;
        }

        login.render(loginRenderObj);
      });
    } else {
      setTimeout(onLoadScript, 100);
    }
  };

  return (
    <>
      <Script
        src="https://www.paypalobjects.com/js/external/api.js"
        strategy="lazyOnload"
        onLoad={onLoadScript}
      />

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
    </>
  );
};

export default PaypalSection;
