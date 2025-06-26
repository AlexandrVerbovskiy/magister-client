import Footer from "../components/_App/Footer";
import Navbar from "../components/_App/Navbar";
import PageBanner from "../components/Common/PageBanner";
import HelloEmailLink from "../components/HelloEmailLink";
import { userSideProps } from "../middlewares";
import { getViewPageWithCategoriesOptions } from "../services";

const TermsOfService = () => {
  return (
    <>
      <Navbar canShowSearch={false} />

      <PageBanner pageTitle="Terms of Service" pageName="Terms of Service" />

      <div className="listings-area ptb-70 inform-page">
        <div className="container mt-4">
          <div className="row m-0">
            <h3>Terms of Service</h3>
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
    baseProps: { pageTitle: "Terms of service" },
  });

export default TermsOfService;
