import Link from "next/link";
import { activateAuthPopup } from "../../utils";
import { useContext } from "react";
import { IndiceContext } from "../../contexts";
import { useListingListClick } from "../../hooks";

const Footer = ({ bgColor }) => {
  const { sessionUser } = useContext(IndiceContext);
  const { handleClick: handleListingListClick } = useListingListClick();
  const { handleClick: handleListingCreateClick } = useListingListClick({
    link: "/dashboard/listings/add",
  });

  const handleSignInClick = (e) => {
    e.preventDefault();
    activateAuthPopup();
  };

  return (
    <>
      <footer className={`footer-area ${bgColor ?? ""}`}>
        <div className="container" style={{ paddingBottom: "3rem" }}>
          <div className="row">
            <div className="col-lg-4 col-sm-6 col-md-6">
              <div className="single-footer-widget">
                <h3>Find</h3>

                <ul className="link-list">
                  {!sessionUser && (
                    <li>
                      <Link href="/" onClick={handleSignInClick}>
                        <i className="flaticon-left-chevron"></i> Login/sign-up
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      href="/"
                      onClick={(e) => {
                        e.preventDefault();
                        handleListingListClick();
                      }}
                    >
                      <i className="flaticon-left-chevron"></i> Search Items
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/"
                      onClick={(e) => {
                        e.preventDefault();
                        handleListingCreateClick();
                      }}
                    >
                      <i className="flaticon-left-chevron"></i> Listings
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-4 col-sm-6 col-md-6">
              <div className="single-footer-widget">
                <h3>Dressrenter </h3>

                <ul className="link-list">
                  <li>
                    <Link href="/our-mission/">
                      <i className="flaticon-left-chevron"></i>Our mission
                    </Link>
                  </li>
                  <li>
                    <Link href="/about-us/">
                      <i className="flaticon-left-chevron"></i> About us
                    </Link>
                  </li>
                  <li>
                    <Link href="/how-it-works/">
                      <i className="flaticon-left-chevron"></i> How it works
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-4 col-sm-6 col-md-6">
              <div className="single-footer-widget">
                <h3>The boring stuff</h3>

                <ul className="link-list">
                  <li>
                    <Link href="/terms-of-service/">
                      <i className="flaticon-left-chevron"></i> Terms of service
                    </Link>
                  </li>
                  <li>
                    <Link href="/owner-guarantee/">
                      <i className="flaticon-left-chevron"></i> Owner guarantee
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy-policy/">
                      <i className="flaticon-left-chevron"></i> Privacy policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/*<div className="col-lg-3 col-sm-6 col-md-6">
              <div className="single-footer-widget">
                <h3>Languages</h3>

                <LangDropdown />

                <h3>Countries</h3>
                <div className="country-switch">
                  <select>
                    <option>United States</option>
                    <option>Canada</option>
                    <option>France</option>
                    <option>Spain</option>
                  </select>
                </div>
              </div>
            </div>*/}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
