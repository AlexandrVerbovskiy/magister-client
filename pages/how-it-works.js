import Footer from "../components/_App/Footer";
import Navbar from "../components/_App/Navbar";
import { userSideProps } from "../middlewares";
import { getViewPageWithCategoriesOptions } from "../services";

const HowItWorks = () => {
  return (
    <>
      <Navbar canShowSearch={false} />
      <div className="listings-area ptb-100">
        <div className="container mt-4">
          <div className="row m-0">
            <h3>How It Works</h3>
            <p>
              At RentAbout, we have streamlined our process to make it as easy
              and efficient as possible for you to benefit from our services.
              Here’s a step-by-step guide on how it works:
            </p>

            <h4>Step 1: Sign Up</h4>
            <p>
              Visit our website and create an account. It’s quick and easy! Just
              provide your basic information, and you’re ready to get started.
            </p>

            <h4>Step 2: Choose a Service</h4>
            <p>
              Browse our wide range of services and select the one that best
              suits your needs. Each service comes with detailed descriptions to
              help you make an informed decision.
            </p>

            <h4>Step 3: Customize Your Order</h4>
            <p>
              Customize your order to fit your specific requirements. You can
              adjust the options to ensure that you get exactly what you need.
            </p>

            <h4>Step 4: Make a Payment</h4>
            <p>
              Proceed to checkout and make a secure payment. We accept various
              payment methods to make the process convenient for you.
            </p>

            <h4>Step 5: Track Your Order</h4>
            <p>
              After placing your order, you can track its progress in real-time
              through your account dashboard. We keep you informed every step of
              the way.
            </p>

            <h4>Step 6: Receive Your Service</h4>
            <p>
              Receive your service as per the scheduled time. We ensure timely
              delivery and top-notch quality.
            </p>

            <h4>Step 7: Provide Feedback</h4>
            <p>
              Your feedback is important to us. After receiving the service,
              please take a moment to let us know about your experience. We are
              constantly striving to improve and your input helps us serve you
              better.
            </p>
            <p>
              That’s it! A simple and hassle-free process designed to provide
              you with the best possible experience.
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
  userSideProps(context, boostServerSideProps);

export default HowItWorks;
