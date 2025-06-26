import Footer from "../components/_App/Footer";
import Navbar from "../components/_App/Navbar";
import PageBanner from "../components/Common/PageBanner";
import { userSideProps } from "../middlewares";
import { getViewPageWithCategoriesOptions } from "../services";

const OurMission = () => {
  return (
    <>
      <Navbar canShowSearch={false} />

      <PageBanner pageTitle="Our Mission" pageName="Our Mission" />

      <div className="listings-area ptb-70">
        <div className="container mt-4">
          <div className="row m-0">
            <h3>Our Mission</h3>
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
    baseProps: { pageTitle: "Our mission" },
  });

export default OurMission;
