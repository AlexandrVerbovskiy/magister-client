import { useContext } from "react";
import { IndiceContext } from "../../contexts";
import ENV from "../../env";
import Link from "next/link";

const PaypalSection = () => {
  const { sessionUser } = useContext(IndiceContext);

  const clientId = ENV.PAYPAL_CLIENT_ID;
  const redirectUri = ENV.CLIENT_URL + "/dashboard/profile-edit/";
  const scope = "https://uri.paypal.com/services/paypalattributes";
  const responseType = "code";
  const mainUrl =
    ENV.PAYPAL_TYPE == "sandbox"
      ? "https://www.sandbox.paypal.com"
      : "https://www.paypal.com";

  const loginUrl = `${mainUrl}/signin/authorize?client_id=${clientId}&response_type=${responseType}&scope=${scope}&redirect_uri=${redirectUri}`;

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
              <div
                id="paypal-connect"
                className={
                  sessionUser?.paypalId ? "update-paypal" : "connect-paypal"
                }
              >
                <Link href={loginUrl}></Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PaypalSection;
