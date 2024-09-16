import Footer from "../components/_App/Footer";
import Navbar from "../components/_App/Navbar";
import { userSideProps } from "../middlewares";
import { getViewPageWithCategoriesOptions } from "../services";
import { useListingListClick } from "../hooks";

const rentingEasyOptions = [
  {
    title: "1. Sign Up",
    description:
      "Visit our website and create an account. It’s quick and easy! Just provide your basic information, and you’re ready to get started.",
    image: "/images/how-it-works/sign-up.png",
  },
  {
    title: "2. Choose an Item",
    description: "Search for items near you and submit a rental request.",
    image: "/images/how-it-works/choose-item.png",
  },
  {
    title: "3. Enjoy your Rental",
    description: "Meet the owner, get the item and enjoy.",
    image: "/images/how-it-works/enjoy-rental.png",
  },
];

const rentingSafelyAndSecurityOptions = [
  {
    title: "1. Sign Up",
    description:
      "Visit our website and create an account. It’s quick and easy! Just provide your basic information, and you’re ready to get started.",
    image: "/images/how-it-works/sign-up.png",
  },
  {
    title: "2. List an Item",
    description:
      "Easy and fast. Add photos, basic information and you're done!",
    image: "/images/how-it-works/item-list.png",
  },
  {
    title: "3. Rental Exchange",
    description:
      "Talk to those who want to rent, and earn money with your items!",
    image: "/images/how-it-works/rental-exchange.png",
  },
];

const HowItWorks = () => {
  const { handleClick: handleStartEarningClick } = useListingListClick({
    link: "/dashboard/listings/add",
  });

  return (
    <>
      <Navbar canShowSearch={false} />
      <div className="main-banner-area how-it-works-main-section">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-6 earn-money-section text-center text-md-start">
              <span className="underlined">Earn money</span> by renting out
            </div>
            <div className="col-12 col-md-6 mt-4 mt-lg-0">
              <img src="/images/how-it-works/earn-money.png" />
            </div>
          </div>
        </div>
      </div>

      <div className="listings-area ptb-100 pb-0 how-it-works-section">
        <div className="container">
          <div className="section-title max-w-max m-0">
            <h2>Renting is easy</h2>
          </div>
          <div className="row justify-content-center">
            {rentingEasyOptions.map((option) => (
              <div
                key={option.title}
                className="how-it-works-box-wrapper col-lg-4 col-md-6 col-sm-6 d-flex"
              >
                <div className="how-it-works-box">
                  <div className="w-100 icon small-icon-image">
                    <img src={option.image} />
                  </div>
                  <div className="w-100 d-flex flex-column">
                    <h3>{option.title}</h3>
                    <p>{option.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="row justify-content-center">
            <button
              type="button"
              className="default-btn"
              onClick={handleStartEarningClick}
            >
              Start earning
            </button>
          </div>
        </div>
      </div>

      <div className="listings-area ptb-100 pb-0 how-it-works-section">
        <div className="container">
          <div className="section-title max-w-max m-0">
            <h2>Earn money safely and securely</h2>
          </div>
          <div className="row justify-content-center">
            {rentingSafelyAndSecurityOptions.map((option) => (
              <div
                key={option.title}
                className="how-it-works-box-wrapper col-lg-4 col-md-6 col-sm-6 d-flex"
              >
                <div className="how-it-works-box">
                  <div className="w-100 icon small-icon-image">
                    <img src={option.image} />
                  </div>
                  <div className="w-100 d-flex flex-column">
                    <h3>{option.title}</h3>
                    <p>{option.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="row justify-content-center">
            <button
              type="button"
              className="default-btn"
              onClick={handleStartEarningClick}
            >
              Start earning
            </button>
          </div>
        </div>
      </div>

      <div className="listings-area ptb-100 how-it-works-section">
        <div className="container">
          <div className="section-title max-w-max m-0">
            <h2>You’re safe with us</h2>
          </div>

          <div className="row justify-content-center mx-0">
            <div className="col-md-6 d-flex p-0">
              <div className="security-box">
                <div className="icon small-icon-image">
                  <img src="/images/how-it-works/everyone-verified.png" />
                </div>
                <div className="d-flex flex-column">
                  <h3>Everyone is verified</h3>
                  <p>
                    All the users will be submitted to a profile verification to
                    use RentAbout. Just the approved users can use our platform.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 d-flex p-0">
              <div className="security-box">
                <div className="icon small-icon-image">
                  <img src="/images/how-it-works/owner-guarantee.png" />
                </div>
                <div className="d-flex flex-column">
                  <h3>Owner guarantee</h3>
                  <p>
                    A protection for both the person who rents and the person
                    who rent out. We have a partnership that will ensure you
                    never lose money.
                  </p>
                </div>
              </div>
            </div>
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
    baseProps: { pageTitle: "How it works" },
  });

export default HowItWorks;
