import Footer from "../components/_App/Footer";
import Navbar from "../components/_App/Navbar";
import { userSideProps } from "../middlewares";
import { getViewPageWithCategoriesOptions } from "../services";

const Circle = ({ color }) => (
  <div className="circle-icon">
    <svg
      width="107"
      height="108"
      viewBox="0 0 107 108"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="53.5" cy="53.5952" r="53.5" fill={color} />
    </svg>
  </div>
);

const AboutUs = () => {
  return (
    <>
      <Navbar canShowSearch={false} alwaysSticky={true} />

      <div className="listings-area ptb-100 bg-f1f1f1">
        <div className="container mt-8 position-relative">
          <div className="row justify-center align-items-center mb-8">
            <div className="col-12 col-lg-6 z-index-1 px-0 d-flex justify-content-end mb-8 mb-lg-0">
              <div className="about-us-card">
                <svg
                  width="56"
                  height="57"
                  viewBox="0 0 56 57"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    y="0.0952148"
                    width="56"
                    height="56"
                    rx="28"
                    fill="#0ec6c6"
                  />
                  <path
                    d="M41.5 28.0952V16.8452C41.5 16.2485 41.2629 15.6762 40.841 15.2542C40.419 14.8323 39.8467 14.5952 39.25 14.5952H16.75C16.1533 14.5952 15.581 14.8323 15.159 15.2542C14.7371 15.6762 14.5 16.2485 14.5 16.8452V39.3452C14.5 39.942 14.7371 40.5142 15.159 40.9362C15.581 41.3582 16.1533 41.5952 16.75 41.5952H28"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M34 38.5952C36.4853 38.5952 38.5 36.5805 38.5 34.0952C38.5 31.6099 36.4853 29.5952 34 29.5952C31.5147 29.5952 29.5 31.6099 29.5 34.0952C29.5 36.5805 31.5147 38.5952 34 38.5952Z"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <path
                    d="M37.75 37.0952L41.5 40.0952M20.5 22.0952H35.5M20.5 28.0952H26.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <h3>Welcome to RentAbout!</h3>

                <p>
                  At RentAbout, we believe in creating a brighter future through
                  innovation, quality, and commitment to our customers. Our
                  journey began in 2023, with a vision to provide exceptional
                  services and products that make a difference in people’s
                  lives.
                </p>
              </div>
            </div>
            <div className="col-12 col-lg-6 d-flex justify-content-start px-0">
              <div className="about-us-image margin-left">
                <img src="/images/about-us/welcome.png" />
              </div>
            </div>
          </div>
          <div className="row justify-center align-items-center mb-8 flex-column-reverse flex-lg-row">
            <div className="col-12 col-lg-6 d-flex justify-content-end px-0">
              <div className="about-us-image margin-right">
                <img src="/images/about-us/mission.png" />
              </div>
            </div>
            <div className="col-12 col-lg-6 z-index-1 px-0 d-flex justify-content-start mb-8 mb-lg-0">
              <div className="about-us-card">
                <svg
                  width="56"
                  height="57"
                  viewBox="0 0 56 57"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    y="0.0952148"
                    width="56"
                    height="56"
                    rx="28"
                    fill="#38CBD6"
                  />
                  <path
                    d="M41.5 28.0952V16.8452C41.5 16.2485 41.2629 15.6762 40.841 15.2542C40.419 14.8323 39.8467 14.5952 39.25 14.5952H16.75C16.1533 14.5952 15.581 14.8323 15.159 15.2542C14.7371 15.6762 14.5 16.2485 14.5 16.8452V39.3452C14.5 39.942 14.7371 40.5142 15.159 40.9362C15.581 41.3582 16.1533 41.5952 16.75 41.5952H28"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M34 38.5952C36.4853 38.5952 38.5 36.5805 38.5 34.0952C38.5 31.6099 36.4853 29.5952 34 29.5952C31.5147 29.5952 29.5 31.6099 29.5 34.0952C29.5 36.5805 31.5147 38.5952 34 38.5952Z"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <path
                    d="M37.75 37.0952L41.5 40.0952M20.5 22.0952H35.5M20.5 28.0952H26.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <h3>Our mission</h3>

                <p>
                  Founded by Selina, a passionate entrepreneur with a vision to
                  transform the industry, our mission is to revolutionise the
                  rental market by fostering sustainable, community-driven
                  platform that leverages cutting-edge technology for an
                  exceptional user experience.
                </p>
              </div>
            </div>
          </div>
          <div className="row justify-center align-items-center mb-8">
            <div className="col-12 col-lg-6 z-index-1 px-0 d-flex justify-content-end">
              <div className="about-us-card mb-8 mb-lg-0">
                <svg
                  width="56"
                  height="57"
                  viewBox="0 0 56 57"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    y="0.604004"
                    width="56"
                    height="56"
                    rx="28"
                    fill="#60C04B"
                  />
                  <path
                    d="M28 27.104C29.9891 27.104 31.8968 27.8942 33.3033 29.3007C34.7098 30.7072 35.5 32.6149 35.5 34.604V43.604H32.5V34.604C32.5001 33.4562 32.0615 32.3517 31.2741 31.5166C30.4866 30.6815 29.4098 30.1788 28.264 30.1115L28 30.104C26.8522 30.1039 25.7477 30.5425 24.9126 31.3299C24.0775 32.1174 23.5748 33.1942 23.5075 34.34L23.5 34.604V43.604H20.5V34.604C20.5 32.6149 21.2902 30.7072 22.6967 29.3007C24.1032 27.8942 26.0109 27.104 28 27.104ZM18.25 31.604C18.67 31.605 19.075 31.652 19.465 31.745C19.2095 32.5088 19.0576 33.3033 19.0135 34.1075L19 34.604V34.733C18.8275 34.6714 18.6482 34.6311 18.466 34.613L18.25 34.604C17.6909 34.604 17.1518 34.8121 16.7378 35.1879C16.3238 35.5636 16.0645 36.08 16.0105 36.6365L16 36.854V43.604H13V36.854C13 35.4616 13.5531 34.1263 14.5377 33.1417C15.5223 32.1571 16.8576 31.604 18.25 31.604ZM37.75 31.604C39.1424 31.604 40.4777 32.1571 41.4623 33.1417C42.4469 34.1263 43 35.4616 43 36.854V43.604H40V36.854C40 36.2949 39.7919 35.7558 39.4161 35.3418C39.0404 34.9278 38.524 34.6685 37.9675 34.6145L37.75 34.604C37.486 34.605 37.236 34.6475 37 34.7315V34.604C37 33.605 36.838 32.645 36.538 31.748C36.925 31.6535 37.333 31.604 37.75 31.604ZM18.25 22.604C19.2446 22.604 20.1984 22.9991 20.9017 23.7024C21.6049 24.4056 22 25.3594 22 26.354C22 27.3486 21.6049 28.3024 20.9017 29.0057C20.1984 29.7089 19.2446 30.104 18.25 30.104C17.2554 30.104 16.3016 29.7089 15.5983 29.0057C14.8951 28.3024 14.5 27.3486 14.5 26.354C14.5 25.3594 14.8951 24.4056 15.5983 23.7024C16.3016 22.9991 17.2554 22.604 18.25 22.604ZM37.75 22.604C38.7446 22.604 39.6984 22.9991 40.4016 23.7024C41.1049 24.4056 41.5 25.3594 41.5 26.354C41.5 27.3486 41.1049 28.3024 40.4016 29.0057C39.6984 29.7089 38.7446 30.104 37.75 30.104C36.7554 30.104 35.8016 29.7089 35.0984 29.0057C34.3951 28.3024 34 27.3486 34 26.354C34 25.3594 34.3951 24.4056 35.0984 23.7024C35.8016 22.9991 36.7554 22.604 37.75 22.604ZM18.25 25.604C18.0511 25.604 17.8603 25.683 17.7197 25.8237C17.579 25.9643 17.5 26.1551 17.5 26.354C17.5 26.5529 17.579 26.7437 17.7197 26.8843C17.8603 27.025 18.0511 27.104 18.25 27.104C18.4489 27.104 18.6397 27.025 18.7803 26.8843C18.921 26.7437 19 26.5529 19 26.354C19 26.1551 18.921 25.9643 18.7803 25.8237C18.6397 25.683 18.4489 25.604 18.25 25.604ZM37.75 25.604C37.5511 25.604 37.3603 25.683 37.2197 25.8237C37.079 25.9643 37 26.1551 37 26.354C37 26.5529 37.079 26.7437 37.2197 26.8843C37.3603 27.025 37.5511 27.104 37.75 27.104C37.9489 27.104 38.1397 27.025 38.2803 26.8843C38.421 26.7437 38.5 26.5529 38.5 26.354C38.5 26.1551 38.421 25.9643 38.2803 25.8237C38.1397 25.683 37.9489 25.604 37.75 25.604ZM28 13.604C29.5913 13.604 31.1174 14.2361 32.2426 15.3614C33.3679 16.4866 34 18.0127 34 19.604C34 21.1953 33.3679 22.7214 32.2426 23.8466C31.1174 24.9719 29.5913 25.604 28 25.604C26.4087 25.604 24.8826 24.9719 23.7574 23.8466C22.6321 22.7214 22 21.1953 22 19.604C22 18.0127 22.6321 16.4866 23.7574 15.3614C24.8826 14.2361 26.4087 13.604 28 13.604ZM28 16.604C27.2044 16.604 26.4413 16.9201 25.8787 17.4827C25.3161 18.0453 25 18.8084 25 19.604C25 20.3997 25.3161 21.1627 25.8787 21.7253C26.4413 22.2879 27.2044 22.604 28 22.604C28.7956 22.604 29.5587 22.2879 30.1213 21.7253C30.6839 21.1627 31 20.3997 31 19.604C31 18.8084 30.6839 18.0453 30.1213 17.4827C29.5587 16.9201 28.7956 16.604 28 16.604Z"
                    fill="white"
                  />
                </svg>

                <h3>Our team</h3>

                <p>
                  Our team is our greatest asset. With a diverse group of
                  professionals from various backgrounds, we bring a wealth of
                  knowledge, experience, and creativity to everything we do. We
                  believe in fostering a culture of collaboration and continuous
                  learning, ensuring that we stay ahead in a constantly evolving
                  market.
                </p>
              </div>
            </div>
            <div className="col-12 col-lg-6 d-flex justify-content-start px-0">
              <div className="about-us-image margin-left">
                <img src="/images/about-us/team.png" />
              </div>
            </div>
          </div>

          <div
            className="position-absolute d-none d-lg-block"
            style={{ left: "50%", top: "195px" }}
          >
            <svg
              width="277"
              height="897"
              viewBox="0 0 277 897"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 2.09521C2 2.09521 137.06 26.7846 193.888 84.0952C252.432 143.135 273 280.095 273 280.095M275 600.595C275 600.595 240.104 718.156 193.888 773.095C137.421 840.222 3 894.095 3 894.095"
                stroke="#DEE01F"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        <div className="divider3"></div>
      </div>

      <div className="listings-area ptb-100 b-0 about-us-goals position-relative">
        <div className="position-absolute circle-border d-none d-lg-block">
          <svg
            width="355"
            height="356"
            viewBox="0 0 355 356"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="177.5"
              cy="177.595"
              r="171.5"
              stroke="black"
              strokeWidth="12"
            />
          </svg>
        </div>

        <div className="row first-goals-row z-index-1 position-relative mx-0">
          <div className="col-lg-6 col-12 d-flex mb-4 mb-lg-0">
            <div className="main-goal-card">
              <h4>Ideas Generation</h4>
              <p>
                We foster a culture of creativity and innovation, encouraging
                every team member to contribute fresh, impactful ideas that
                drive our growth and success.
              </p>
            </div>
            <Circle color="#574DBE" />
          </div>

          <div className="col-12 col-lg-6 d-flex mb-4 mb-lg-0">
            <Circle color="#54C247" />
            <div className="main-goal-card">
              <h4>Analytical Excellence</h4>
              <p>
                We prioritise data-driven decision making and critical thinking,
                ensuring that our strategies are grounded in analysis and
                insightful evaluation.
              </p>
            </div>
          </div>
        </div>

        <div className="row second-goals-row z-index-1 position-relative mx-0">
          <div className="col-12 col-lg-6 d-flex mb-4 mb-lg-0">
            <div className="main-goal-card">
              <h4>Going Above and Beyond</h4>
              <p>
                We are committed to exceeding expectations, delivering
                exceptional service, and continually striving to surpass our
                goals.
              </p>
            </div>
            <Circle color="#26979C" />
          </div>

          <div className="col-12 col-lg-6 d-flex mb-4 mb-lg-0">
            <Circle color="#D6E30F" />
            <div className="main-goal-card">
              <h4>Helping Others</h4>
              <p>
                We believe in the power of community and support, always ready
                to lend a hand, share knowledge, and collaborate to achieve
                collective success.
              </p>
            </div>
          </div>
        </div>

        <div className="row third-goals-row z-index-1 position-relative mx-0">
          <div className="col-12 d-flex mb-4 mb-lg-0">
            <Circle color="#4ACCD4" />
            <div className="main-goal-card">
              <h4>Flexibility</h4>
              <p>
                We embrace change and adaptability, maintaining a dynamic and
                responsive approach to meet the evolving needs of our customers
                and industry.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="listings-area about-us-thanks-for-visiting">
        <div className="h-100 mx-4 d-flex justify-content-center align-items-center">
          <div className="thanks-for-visiting-icon">
            <img src="/images/about-us/thanks-for-visiting.svg" />
          </div>
          <div>
            Thanks for visiting our site. We look forward to serving you!
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
    baseProps: { pageTitle: "About us" },
  });

export default AboutUs;
