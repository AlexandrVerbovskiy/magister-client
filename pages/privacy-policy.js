import Footer from "../components/_App/Footer";
import Navbar from "../components/_App/Navbar";
import { userSideProps } from "../middlewares";
import { getViewPageWithCategoriesOptions } from "../services";
import PageBanner from "../components/Common/PageBanner";
import SupportEmailLink from "../components/SupportEmailLink";
import HelloEmailLink from "../components/HelloEmailLink";

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar canShowSearch={false} />

      <PageBanner pageTitle="Privacy Policy" pageName="Privacy Policy" />

      <div className="listings-area ptb-70 inform-page">
        <div className="container mt-4">
          <div className="row m-0">
            <h3>PRIVACY POLICY – DRESSRENTER LIMITED</h3>
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
    baseProps: { pageTitle: "Privacy policy" },
  });

export default PrivacyPolicy;
