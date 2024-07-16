import Footer from "../components/_App/Footer";
import Navbar from "../components/_App/Navbar";
import { userSideProps } from "../middlewares";
import { getViewPageWithCategoriesOptions } from "../services";
import PageBanner from "../components/Common/PageBanner";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar canShowSearch={false} />

      <PageBanner pageTitle="Privacy Policy" pageName="Privacy Policy" />

      <div className="faq-area bg-f9f9f9 pt-100 pb-70">
        <div className="container">
          <div class="row">
            <div class="col-12">
              <h2>Privacy Policy</h2>
              <div className="faq-item">
                <p>
                  When you join RentAbout, you trust us with your information,
                  and we take that responsibility seriously. This Privacy Policy
                  outlines what data we collect, how we use it, and how we
                  protect it. If you have any questions, please contact us at{" "}
                  <a href="mailto:hello@rentabout.com">hello@rentabout.com</a>.
                </p>
              </div>
            </div>

            <div className="col-12">
              <div className="faq-item">
                <h3>Who are we?</h3>
                <p>
                  We are RentAbout Limited (referred to as “we”, “our”, or
                  “us”). Our registered office address is Sci-Tech Daresbury,
                  Keckwick Lane, Daresbury WA4 4FS. Our company number is
                  15277425.
                </p>
              </div>
            </div>

            <div className="col-12">
              <div className="faq-item">
                <h3>What information do we collect?</h3>
                <p>
                  <strong>Information you submit:</strong> To verify your
                  account and ensure RentAbout is a safe place to rent, we may
                  collect your name, ID, email address, phone number, selfie,
                  address, and employment or education details. We also collect
                  information from communications you make through the platform
                  and about how you use the app and website.
                </p>
                <p>
                  <strong>Phone usage information:</strong> This includes your
                  mobile network, IP address, operating system, and phone
                  settings.
                </p>
                <p>
                  <strong>Permissions:</strong> We might access your photos and
                  camera (to post photos of your items) and your geolocation (to
                  show relevant items) with your explicit permission.
                </p>
                <p>
                  <strong>Social media accounts:</strong> Information from any
                  social media accounts you share with us or use to sign up.
                </p>
                <p>
                  <strong>Cookies:</strong> We use cookies to track your
                  activity on our site to improve your experience. You can turn
                  cookies off in your browser or phone settings, but this may
                  reduce the quality of your experience.
                </p>
              </div>
            </div>

            <div className="col-12">
              <div className="faq-item">
                <h3>How do we use your information?</h3>
                <p>
                  <ul>
                    <li>
                      To provide and improve our services: We use your data to
                      enable you to use RentAbout, communicate with other users,
                      access customer service, and receive notifications.
                    </li>
                    <li>
                      To contact you: We may contact you via email, SMS, or
                      phone about your RentAbout account.
                    </li>
                    <li>
                      To ensure safety and meet legal obligations: We use your
                      data to prevent illegal activities, enforce our Terms of
                      Service, and resolve disputes.
                    </li>
                    <li>
                      For legitimate interests: We might use your data to market
                      products, services, or new features that we think you’ll
                      like.
                    </li>
                  </ul>
                </p>
              </div>
            </div>

            <div className="col-12">
              <div className="faq-item">
                <h3>Who do we share your information with?</h3>
                <p>
                  <ul>
                    <li>
                      Internal use: Only employees who need your data to do
                      their job will access it.
                    </li>
                    <li>
                      With other users: Your phone number will be shared with
                      users you’ve made rental agreements with.
                    </li>
                    <li>
                      Service providers: We may share your data with
                      organizations that support our services, such as payment
                      processors (like Stripe) and customer messaging platforms
                      (like Intercom).
                    </li>
                    <li>
                      Regulatory authorities: If necessary, we share information
                      to comply with legal obligations and to protect the
                      rights, property, or safety of our users.
                    </li>
                  </ul>
                </p>
              </div>
            </div>

            <div className="col-12">
              <div className="faq-item">
                <h3>Your rights:</h3>
                <p>
                  <ul>
                    <li>
                      Access and update: You can access and update your
                      information through your RentAbout account.
                    </li>
                    <li>
                      Request copies: In some jurisdictions, you can request
                      copies of personal information not visible in your
                      account, unless the request is unfounded, repetitive, or
                      excessive.
                    </li>
                    <li>
                      Correction: Ask us to correct inaccurate or incomplete
                      information.
                    </li>
                    <li>
                      Deletion: Request to delete your data, although we may
                      retain information necessary for legal obligations and
                      legitimate business interests.
                    </li>
                    <li>
                      Objection: Object to our use of your data for direct
                      marketing and certain other purposes.
                    </li>
                    <li>
                      Withdrawal of consent: Withdraw any consent you’ve given
                      us.
                    </li>
                  </ul>
                </p>
              </div>
            </div>

            <div className="col-12">
              <div className="faq-item">
                <h3>Where do we store your data?</h3>
                <p>
                  We use SSL encryption to transmit your data securely.
                  Verification information is stored in encrypted form,
                  accessible only to authorized employees. Data collected within
                  the EEA may be transferred outside the EEA with appropriate
                  safeguards in place.
                </p>
              </div>
            </div>

            <div className="col-12">
              <div className="faq-item">
                <h3>Creditworthiness:</h3>
                <p>
                  For qualifying long-term rental plans, we may assess your
                  creditworthiness through credit reference agencies, like
                  Experian.
                </p>
              </div>
            </div>

            <div className="col-12">
              <div className="faq-item">
                <h3>How to contact us or make a complaint:</h3>
                <p>
                  Contact us at{" "}
                  <a href="mailto:hello@rentabout.com">hello@rentabout.com</a>{" "}
                  with any questions or complaints. If you’re not satisfied with
                  our response, you can refer your complaint to the Financial
                  Ombudsman Service.
                </p>
              </div>
            </div>

            <div className="col-12">
              <div className="faq-item">
                <h3>Changes to this policy:</h3>
                <p>
                  We’ll post any changes to our privacy policy here. Significant
                  changes will be communicated via email.
                </p>
              </div>
            </div>
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
  userSideProps(context, boostServerSideProps);

export default PrivacyPolicy;
