import Footer from "../components/_App/Footer";
import Navbar from "../components/_App/Navbar";
import { authSideProps } from "../middlewares";
import { getViewPageWithCategoriesOptions } from "../services";

const InsuranceGuarantee = () => {
  return (
    <>
      <Navbar canShowSearch={false} />
      <div className="listings-area ptb-100">
        <div className="container mt-4">
          <div className="row m-0">
            <h3>Insurance Guarantee</h3>
            <p>
              At RentAbout, we understand the importance of peace of mind when
              using our services. That’s why we offer a comprehensive insurance
              guarantee to protect you and your investment.
            </p>

            <h4>What is Covered?</h4>
            <p>
              Our insurance guarantee covers a wide range of scenarios,
              including but not limited to:
            </p>
            <ul>
              <li>
                <strong>Product Defects</strong>: If you receive a product with
                a manufacturing defect, we will replace it at no additional
                cost.
              </li>
              <li>
                <strong>Service Issues</strong>: If our service does not meet
                the agreed-upon standards, we will rectify the situation or
                provide a refund.
              </li>
              <li>
                <strong>Damage During Delivery</strong>: If your order is
                damaged during transit, our insurance will cover the cost of
                repairs or replacement.
              </li>
            </ul>

            <h4>How to File a Claim?</h4>
            <p>
              If you encounter any issues that you believe are covered under our
              insurance guarantee, follow these steps to file a claim:
            </p>
            <ol>
              <li>
                <strong>Contact Us</strong>: Reach out to our customer service
                team as soon as possible and provide details about the issue.
              </li>
              <li>
                <strong>Submit Documentation</strong>: Provide any necessary
                documentation, such as photos, receipts, or service reports, to
                support your claim.
              </li>
              <li>
                <strong>Assessment</strong>: Our team will assess the claim and
                determine the appropriate course of action.
              </li>
              <li>
                <strong>Resolution</strong>: We will work with you to resolve
                the issue promptly, whether it involves a replacement, repair,
                or refund.
              </li>
            </ol>

            <h4>Terms and Conditions</h4>
            <p>
              Please note that our insurance guarantee is subject to certain
              terms and conditions, which can be reviewed in detail on our
              website. It is important to familiarize yourself with these terms
              to understand the full extent of your coverage.
            </p>
            <p>
              We are committed to your satisfaction and will do everything
              possible to ensure that you are fully protected under our
              insurance guarantee.
            </p>
          </div>
        </div>
      </div>
      <Footer bgColor="bg-f5f5f5" />
    </>
  );
};

getViewPageWithCategoriesOptions;

const boostServerSideProps = async () => {
  const options = await getViewPageWithCategoriesOptions();
  return { ...options };
};

export const getServerSideProps = (context) =>
  authSideProps(context, boostServerSideProps);

export default InsuranceGuarantee;
