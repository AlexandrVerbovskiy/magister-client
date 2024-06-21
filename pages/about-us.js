import Footer from "../components/_App/Footer";
import Navbar from "../components/_App/Navbar";
import { authSideProps } from "../middlewares";
import { getViewPageWithCategoriesOptions } from "../services";

const AboutUs = () => {
  return (
    <>
      <Navbar canShowSearch={false} />
      <div className="listings-area ptb-100">
        <div className="container mt-4">
          <div className="row m-0">
            <h3>Welcome to RentAbout!</h3>
            <p>
              At RentAbout, we believe in creating a brighter future through
              innovation, quality, and commitment to our customers. Our journey
              began in 2024, with a vision to provide exceptional services and
              products that make a difference in people’s lives.
            </p>

            <h4>Our Story</h4>
            <p>
              Founded by Test, a passionate entrepreneur with a vision to
              transform the industry, we have grown from a small startup into a
              leading company known for our dedication to excellence. Over the
              years, we have built a team of experts who share our values and
              strive to exceed our customers' expectations.
            </p>

            <h4>Our Team</h4>
            <p>
              Our team is our greatest asset. With a diverse group of
              professionals from various backgrounds, we bring a wealth of
              knowledge, experience, and creativity to everything we do. We
              believe in fostering a culture of collaboration and continuous
              learning, ensuring that we stay ahead in a constantly evolving
              market.
            </p>

            <h4>Our Values</h4>
            <ul>
              <li>
                <strong>Integrity</strong>: We are committed to maintaining the
                highest standards of honesty and transparency in all our
                dealings.
              </li>
              <li>
                <strong>Quality</strong>: We strive for excellence in every
                aspect of our work, ensuring that our products and services are
                of the highest quality.
              </li>
              <li>
                <strong>Innovation</strong>: We embrace change and continuously
                seek new and better ways to serve our customers.
              </li>
            </ul>
            <p>
              Thank you for visiting our site. We look forward to serving you!
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

export default AboutUs;
