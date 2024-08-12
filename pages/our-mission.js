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
            <p>
              At RentAbout, our mission is to inspire and empower our customers
              through innovation, quality, and exceptional service. We are
              dedicated to making a positive impact in the lives of our clients,
              employees, and the community.
            </p>

            <h4>Inspiring Innovation</h4>
            <p>
              We believe that innovation is the key to progress. Our goal is to
              continuously explore new ideas and technologies to develop
              products and services that enhance your experience and meet your
              evolving needs.
            </p>

            <h4>Commitment to Quality</h4>
            <p>
              Quality is at the heart of everything we do. We are committed to
              providing products and services that meet the highest standards of
              excellence. Our dedication to quality ensures that you receive the
              best value and performance.
            </p>

            <h4>Customer-Centric Approach</h4>
            <p>
              Our customers are our top priority. We strive to understand your
              needs and provide solutions that exceed your expectations. Your
              satisfaction drives us to improve and innovate continuously.
            </p>

            <h4>Social Responsibility</h4>
            <p>
              We are committed to making a positive impact on society and the
              environment. We believe in giving back to the community and are
              dedicated to sustainable practices that promote a better future
              for all.
            </p>
            <p>
              Thank you for being a part of our journey. Together, we can create
              a brighter and more innovative future.
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
    baseProps: { pageTitle: "Our mission" },
  });

export default OurMission;
