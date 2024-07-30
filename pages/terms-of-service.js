import Footer from "../components/_App/Footer";
import Navbar from "../components/_App/Navbar";
import PageBanner from "../components/Common/PageBanner";
import SupportEmailLink from "../components/SupportEmailLink";
import { userSideProps } from "../middlewares";
import { getViewPageWithCategoriesOptions } from "../services";

const TermsOfService = () => {
  return (
    <>
      <Navbar canShowSearch={false} />

      <PageBanner pageTitle="Terms of Service" pageName="Terms of Service" />

      <div className="listings-area ptb-70">
        <div className="container mt-4">
          <div className="row m-0">
            <h3>Terms of Service</h3>
            <p>
              <strong>Effective Date: 21.06.2025</strong>
            </p>
            <p>
              Welcome to RentAbout! These Terms of Service ("Terms") govern your
              use of our website and services.
            </p>

            <h4>Acceptance of Terms</h4>
            <p>
              By accessing or using our website, you agree to be bound by these
              Terms. If you do not agree to these Terms, please do not use our
              website or services.
            </p>

            <h4>Services Provided</h4>
            <p>
              RentAbout offers a range of products and services that may be
              subject to additional terms and conditions. By using our services,
              you agree to comply with these terms.
            </p>

            <h4>User Responsibilities</h4>
            <p className="mb-1">As a user, you agree to:</p>
            <div className="p-0">
              <ul>
                <li>Provide accurate and current information</li>
                <li>Use our services for lawful purposes only</li>
                <li>
                  Respect the rights of others and not engage in harmful or
                  disruptive behavior
                </li>
              </ul>
            </div>

            <h4>Intellectual Property</h4>
            <p>
              All content on our website, including text, graphics, logos, and
              images, is the property of RentAbout and is protected by
              intellectual property laws. You may not use our content without
              permission.
            </p>

            <h4>Limitation of Liability</h4>
            <p>
              To the fullest extent permitted by law, RentAbout shall not be
              liable for any direct, indirect, incidental, special, or
              consequential damages arising from your use of our services.
            </p>

            <h4>Governing Law</h4>
            <p>
              These Terms are governed by and construed in accordance with the
              laws of United Kingdom. Any disputes arising out of or related to
              these Terms shall be resolved in the courts of United Kingdom.
            </p>

            <h4>Changes to Terms</h4>
            <p>
              We may update these Terms from time to time. Any changes will be
              posted on this page, and the effective date will be updated.
            </p>

            <h4>Contact Us</h4>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
              <SupportEmailLink />.
            </p>
          </div>
        </div>
      </div>
      <Footer bgColor="bg-f5f5f5" />
    </>
  );
};

const boostServerSideProps = async () => {
  const options = await getViewPageWithCategoriesOptions();
  return { ...options };
};

export const getServerSideProps = (context) =>
  userSideProps(context, boostServerSideProps);

export default TermsOfService;