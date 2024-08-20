import Footer from "../components/_App/Footer";
import Navbar from "../components/_App/Navbar";
import PageBanner from "../components/Common/PageBanner";
import SupportEmailLink from "../components/SupportEmailLink";
import { userSideProps } from "../middlewares";
import { getViewPageWithCategoriesOptions } from "../services";

const UserDataDeletion = () => {
  return (
    <>
      <Navbar canShowSearch={false} />

      <PageBanner
        pageTitle="User Data Deletion"
        pageName="User Data Deletion"
      />

      <div className="listings-area ptb-70">
        <div className="container mt-4">
          <div className="row m-0">
            <h3>User Data Deletion Instructions</h3>
            <p>
              As part of our commitment to user privacy and data security, we
              provide users with the ability to delete their data at any time.
              If you have used Facebook Auth to sign up for our service and wish
              to delete your data, please follow the instructions below:
            </p>

            <h4>Log into Your Account</h4>
            <p>
              Visit our website or open our app.
              <br />
              Log into your account using Facebook Auth.
            </p>

            <h4>Navigate to Account Settings</h4>
            <p>
              Go to the account settings section. This can usually be found in
              the profile or settings menu.
            </p>

            <h4>Request Data Deletion</h4>
            <p>
              Locate the data deletion or privacy section within the account
              settings.
              <br />
              Click on the “Delete My Data” or similar option.
              <br />
              Confirm your request when prompted.
            </p>

            <h4>Confirm Deletion via Email</h4>
            <p>
              You will receive an email to confirm your data deletion request.
              <br />
              Follow the instructions in the email to confirm your request.
            </p>

            <h4>Data Deletion Processing</h4>
            <p>
              Once confirmed, we will process your data deletion request. All
              your personal data associated with your account will be
              permanently deleted from our servers within 30 days.
            </p>

            <h4>Contact Support (If Needed)</h4>
            <p>
              If you encounter any issues or have any questions regarding the
              data deletion process, please contact our support team at{" "}
              <SupportEmailLink />.
            </p>

            <p>
              By following these steps, you can ensure that all your data is
              securely and permanently deleted from our service. We value your
              privacy and strive to make this process as straightforward as
              possible.
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
  userSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "User data deletion" },
  });

export default UserDataDeletion;
