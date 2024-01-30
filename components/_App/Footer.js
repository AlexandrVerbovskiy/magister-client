import Link from "next/link";
import LangDropdown from "./LangDropdown";

const Footer = ({ bgColor }) => {
  return (
    <>
      <footer className={`footer-area ${bgColor}`}>
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-sm-6 col-md-6">
              <div className="single-footer-widget">
                <h3>About</h3>

                <ul className="link-list">
                  <li>
                    <Link href="/about">
                      <i className="flaticon-left-chevron"></i> About Indice
                    </Link>
                  </li>
                  <li>
                    <Link href="/about">
                      <i className="flaticon-left-chevron"></i> Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="/events">
                      <i className="flaticon-left-chevron"></i> Recent News
                    </Link>
                  </li>
                  <li>
                    <Link href="/testimonial">
                      <i className="flaticon-left-chevron"></i> Investor
                      Relations
                    </Link>
                  </li>
                  <li>
                    <Link href="/how-it-works">
                      <i className="flaticon-left-chevron"></i> Content
                      Guidelines
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq">
                      <i className="flaticon-left-chevron"></i> Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq">
                      <i className="flaticon-left-chevron"></i> Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6 col-md-6">
              <div className="single-footer-widget">
                <h3>Discover</h3>

                <ul className="link-list">
                  <li>
                    <Link href="/pricing">
                      <i className="flaticon-left-chevron"></i> Project Cost
                      Guides
                    </Link>
                  </li>
                  <li>
                    <Link href="/events">
                      <i className="flaticon-left-chevron"></i> Upcoming Events
                    </Link>
                  </li>
                  <li>
                    <Link href="/gallery">
                      <i className="flaticon-left-chevron"></i> Mobile App
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact">
                      <i className="flaticon-left-chevron"></i> Customer Support
                    </Link>
                  </li>
                  <li>
                    <Link href="/testimonial">
                      <i className="flaticon-left-chevron"></i> Developers
                    </Link>
                  </li>
                  <li>
                    <Link href="/gallery">
                      <i className="flaticon-left-chevron"></i> Collections
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog-1">
                      <i className="flaticon-left-chevron"></i> Our Blog
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6 col-md-6">
              <div className="single-footer-widget">
                <h3>Business With Indice</h3>

                <ul className="link-list">
                  <li>
                    <Link href="/testimonial">
                      <i className="flaticon-left-chevron"></i> Claim your
                      Business
                    </Link>
                  </li>
                  <li>
                    <Link href="/gallery">
                      <i className="flaticon-left-chevron"></i> Advertise on
                      Indice
                    </Link>
                  </li>
                  <li>
                    <Link href="/events">
                      <i className="flaticon-left-chevron"></i> Restaurant
                      Owners
                    </Link>
                  </li>
                  <li>
                    <Link href="/testimonial">
                      <i className="flaticon-left-chevron"></i> Business Success
                      Stories
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact">
                      <i className="flaticon-left-chevron"></i> Business Support
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog-1">
                      <i className="flaticon-left-chevron"></i> Blog for
                      Business
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq">
                      <i className="flaticon-left-chevron"></i> Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6 col-md-6">
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
            </div>
          </div>

          <div className="copyright-area">
            <p>
              Copyright <span>Indice</span> is Proudly Owned by{" "}
              <a href="https://envytheme.com/" target="_blank" rel="noreferrer">
                EnvyTheme
              </a>
            </p>
          </div>
        </div>

        <div className="footer-image text-center">
          <img src="/images/footer-image.png" alt="image" />
        </div>
      </footer>
    </>
  );
};

export default Footer;
