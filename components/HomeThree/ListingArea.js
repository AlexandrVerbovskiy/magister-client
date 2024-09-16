import Link from "next/link";

const ListingArea = () => {
  return (
    <>
      <section className="listings-area ptb-100 bg-f9f9f9">
        <div className="container">
          <div className="section-title">
            <h2>Places We Recommend You Visit</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis
              ipsum suspendisse ultrices gravida. Risus commodo viverra.
            </p>
          </div>

          <div className="row">
            <div className="col-lg-6 col-md-12">
              <div className="single-listings-item">
                <div className="row m-0">
                  <div className="col-lg-4 col-md-4 p-0">
                    <div className="listings-image bg-img1">
                      <Link href="/single-listings">
                        <img src="/images/listings/listings9.jpg" alt="image" />
                      </Link>
                      <Link href="/single-listings" className="bookmark-save">
                        <i className="flaticon-heart"></i>
                      </Link>
                      <Link href="/single-listings" className="category">
                        <i className="flaticon-cooking"></i>
                      </Link>

                      <Link href="#" className="link-btn"></Link>

                      <div className="author">
                        <div className="d-flex align-items-center">
                          <Link href="/single-listings">
                            <img src="/images/user3.jpg" alt="image" />
                          </Link>
                          <span>James</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-8 col-md-8 p-0">
                    <div className="listings-content">
                      <span className="status">
                        <i className="flaticon-save"></i> Open Now
                      </span>
                      <h3>
                        <Link href="/single-listings">The Mad Made Grill</Link>
                      </h3>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="rating">
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <span className="count">(18)</span>
                        </div>
                        <div className="price">
                          Start From <span>$121</span>
                        </div>
                      </div>
                      <ul className="listings-meta">
                        <li>
                          <Link href="/single-listings">
                            <i className="flaticon-furniture-and-household"></i>{" "}
                            Restaurant
                          </Link>
                        </li>
                        <li>
                          <Link href="/single-listings">
                            <i className="flaticon-pin"></i> New York, USA
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-12">
              <div className="single-listings-item">
                <div className="row m-0">
                  <div className="col-lg-4 col-md-4 p-0">
                    <div className="listings-image bg-img2">
                      <Link href="/single-listings">
                        <img
                          src="/images/listings/listings10.jpg"
                          alt="image"
                        />
                      </Link>
                      <a href="#" className="bookmark-save">
                        <i className="flaticon-heart"></i>
                      </a>
                      <a href="#" className="category">
                        <i className="flaticon-cooking"></i>
                      </a>
                      <a href="#" className="link-btn"></a>
                      <div className="author">
                        <div className="d-flex align-items-center">
                          <img src="/images/user2.jpg" alt="image" />
                          <span>Sarah</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-8 col-md-8 p-0">
                    <div className="listings-content">
                      <span className="status">
                        <i className="flaticon-save"></i> Open Now
                      </span>
                      <h3>
                        <Link href="/single-listings">
                          The Beverly Hills Hotel
                        </Link>
                      </h3>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="rating">
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <i className="bx bx-star"></i>
                          <span className="count">(10)</span>
                        </div>
                        <div className="price">
                          Start From <span>$200</span>
                        </div>
                      </div>
                      <ul className="listings-meta">
                        <li>
                          <Link href="/single-listings">
                            <i className="flaticon-hotel"></i> Hotel
                          </Link>
                        </li>
                        <li>
                          <Link href="/single-listings">
                            <i className="flaticon-pin"></i> Los Angeles, USA
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-12">
              <div className="single-listings-item">
                <div className="row m-0">
                  <div className="col-lg-4 col-md-4 p-0">
                    <div className="listings-image bg-img3">
                      <Link href="/single-listings">
                        <img
                          src="/images/listings/listings11.jpg"
                          alt="image"
                        />
                      </Link>
                      <a href="#" className="bookmark-save">
                        <i className="flaticon-heart"></i>
                      </a>
                      <a href="#" className="category">
                        <i className="flaticon-cooking"></i>
                      </a>
                      <a href="#" className="link-btn"></a>
                      <div className="author">
                        <div className="d-flex align-items-center">
                          <img src="/images/user5.jpg" alt="image" />
                          <span>Lina</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-8 col-md-8 p-0">
                    <div className="listings-content">
                      <span className="status">
                        <i className="flaticon-save"></i> Open Now
                      </span>
                      <h3>
                        <Link href="/single-listings">
                          Blue Water Shopping City
                        </Link>
                      </h3>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="rating">
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <span className="count">(55)</span>
                        </div>
                        <div className="price">
                          Start From <span>$500</span>
                        </div>
                      </div>
                      <ul className="listings-meta">
                        <li>
                          <Link href="/single-listings">
                            <i className="flaticon-shopping-bags"></i> Shopping
                          </Link>
                        </li>
                        <li>
                          <Link href="/single-listings">
                            <i className="flaticon-pin"></i> Seattle, USA
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-12">
              <div className="single-listings-item">
                <div className="row m-0">
                  <div className="col-lg-4 col-md-4 p-0">
                    <div className="listings-image bg-img4">
                      <Link href="/single-listings">
                        <img
                          src="/images/listings/listings12.jpg"
                          alt="image"
                        />
                      </Link>
                      <a href="#" className="bookmark-save">
                        <i className="flaticon-heart"></i>
                      </a>
                      <a href="#" className="category">
                        <i className="flaticon-cooking"></i>
                      </a>
                      <a href="#" className="link-btn"></a>
                      <div className="author">
                        <div className="d-flex align-items-center">
                          <img src="/images/user1.jpg" alt="image" />
                          <span>Taylor</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-8 col-md-8 p-0">
                    <div className="listings-content">
                      <span className="status status-close">
                        <i className="flaticon-save"></i> Close Now
                      </span>
                      <h3>
                        <Link href="/single-listings">
                          Chipotle Mexican Grill
                        </Link>
                      </h3>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="rating">
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <i className="bx bxs-star"></i>
                          <span className="count">(45)</span>
                        </div>
                        <div className="price">
                          Start From <span>$150</span>
                        </div>
                      </div>
                      <ul className="listings-meta">
                        <li>
                          <Link href="/single-listings">
                            <i className="flaticon-furniture-and-household"></i>{" "}
                            Restaurant
                          </Link>
                        </li>
                        <li>
                          <Link href="/single-listings">
                            <i className="flaticon-pin"></i> New York, USA
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-12 col-md-12">
              <div className="more-listings-box">
                <Link href="/single-listings" className="default-btn">
                  More Listings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ListingArea;
