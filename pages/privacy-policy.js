import Footer from "../components/_App/Footer";
import Navbar from "../components/_App/Navbar";
import { authSideProps } from "../middlewares";
import { getViewPageWithCategoriesOptions } from "../services";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar canShowSearch={false} />
      <div className="listings-area ptb-100">
        <div className="container mt-4">
          <div className="row m-0">
            <h3>Privacy Policy</h3>
            <p>
              <strong>Effective Date: 21.06.2025</strong>
            </p>
            <p>
              At RentAbout, we are committed to protecting your privacy. This
              Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you visit our website.
            </p>

            <h4>Information We Collect</h4>
            <p>
              We may collect information about you in a variety of ways,
              including:
            </p>
            <ul>
              <li>
                <strong>Personal Data</strong>: Identifiable information such as
                your name, shipping address, email address, and telephone
                number.
              </li>
              <li>
                <strong>Derivative Data</strong>: Information our servers
                collect automatically, such as your IP address, browser type,
                and access times.
              </li>
              <li>
                <strong>Financial Data</strong>: Data related to your payment
                method (e.g., valid credit card number, card brand, expiration
                date).
              </li>
            </ul>

            <h4>Use of Your Information</h4>
            <p>We use your information to:</p>
            <ul>
              <li>Provide and manage your account</li>
              <li>Process your transactions</li>
              <li>Communicate with you regarding updates or offers</li>
              <li>Improve our services and website functionality</li>
              <li>Prevent fraudulent transactions</li>
            </ul>

            <h4>Disclosure of Your Information</h4>
            <p>
              We may share information we have collected about you in certain
              situations:
            </p>
            <ul>
              <li>
                With service providers who perform services for us or on our
                behalf
              </li>
              <li>
                In connection with any merger, sale of company assets,
                financing, or acquisition
              </li>
              <li>
                To comply with a legal obligation or protect against legal
                liability
              </li>
            </ul>

            <h4>Security of Your Information</h4>
            <p>
              We use administrative, technical, and physical security measures
              to help protect your personal information. However, no security
              measures are perfect, and we cannot guarantee the absolute
              security of your information.
            </p>

            <h4>Your Rights</h4>
            <p>
              Depending on your location, you may have certain rights regarding
              your personal data, including the right to access, correct, or
              delete your information.
            </p>

            <h4>Changes to This Privacy Policy</h4>
            <p>
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page, and the effective date will be
              updated.
            </p>

            <h4>Contact Us</h4>
            <p>
              If you have any questions or concerns about this Privacy Policy,
              please contact us at test@gmail.com.
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

export default PrivacyPolicy;
