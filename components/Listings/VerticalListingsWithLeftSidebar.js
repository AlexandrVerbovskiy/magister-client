import React from "react";
import Link from "next/link";
import Sidebar from "./Sidebar";

const VerticalListingsWithLeftSidebar = () => {
  return (
    <>
      <div className="listings-area ptb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-12">
              <Sidebar />
            </div>

            <div className="col-lg-8 col-md-12">
              <div className="listings-grid-sorting row align-items-center">
                <div className="col-lg-5 col-md-6 result-count">
                  <p>
                    We found <span className="count">9</span> listings available
                    for you
                  </p>
                </div>

                <div className="col-lg-7 col-md-6 ordering">
                  <div className="d-flex justify-content-end">
                    <div className="select-box">
                      <label>Sort By:</label>
                      <select className="blog-select">
                        <option>Recommended</option>
                        <option>Default</option>
                        <option>Popularity</option>
                        <option>Latest</option>
                        <option>Price: low to high</option>
                        <option>Price: high to low</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="single-listings-item">
                    <div className="row m-0">
                      <div className="col-lg-4 col-md-4 p-0">
                        <div className="listings-image bg-img1">
                          <img
                            src="/images/listings/listings9.jpg"
                            alt="image"
                          />
                          <a href="#" className="bookmark-save">
                            <i className="flaticon-heart"></i>
                          </a>
                          <a href="#" className="category">
                            <i className="flaticon-cooking"></i>
                          </a>
                          <Link
                            href="/single-listings"
                            className="link-btn"
                          ></Link>
                          <div className="author">
                            <div className="d-flex align-items-center">
                              <img src="/images/user3.jpg" alt="image" />
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
                            <Link href="/single-listings">
                              The Mad Made Grill
                            </Link>
                          </h3>
                          <div
                            className="
                            d-flex
                            align-items-center
                            justify-content-between
                          "
                          >
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
                              <a href="#">
                                <i className="flaticon-furniture-and-household"></i>
                                Restaurant
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <i className="flaticon-pin"></i> New York, USA
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="single-listings-item">
                    <div className="row m-0">
                      <div className="col-lg-4 col-md-4 p-0">
                        <div className="listings-image bg-img2">
                          <img
                            src="/images/listings/listings10.jpg"
                            alt="image"
                          />
                          <a href="#" className="bookmark-save">
                            <i className="flaticon-heart"></i>
                          </a>
                          <a href="#" className="category">
                            <i className="flaticon-cooking"></i>
                          </a>
                          <Link
                            href="/single-listings"
                            className="link-btn"
                          ></Link>
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
                          <div
                            className="
                            d-flex
                            align-items-center
                            justify-content-between
                          "
                          >
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
                              <a href="#">
                                <i className="flaticon-hotel"></i> Hotel
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <i className="flaticon-pin"></i> Los Angeles,
                                USA
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="single-listings-item">
                    <div className="row m-0">
                      <div className="col-lg-4 col-md-4 p-0">
                        <div className="listings-image bg-img3">
                          <img
                            src="/images/listings/listings11.jpg"
                            alt="image"
                          />
                          <a href="#" className="bookmark-save">
                            <i className="flaticon-heart"></i>
                          </a>
                          <a href="#" className="category">
                            <i className="flaticon-cooking"></i>
                          </a>
                          <Link
                            href="/single-listings"
                            className="link-btn"
                          ></Link>
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
                          <div
                            className="
                            d-flex
                            align-items-center
                            justify-content-between
                          "
                          >
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
                              <a href="#">
                                <i className="flaticon-shopping-bags"></i>
                                Shopping
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <i className="flaticon-pin"></i> Seattle, USA
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="single-listings-item">
                    <div className="row m-0">
                      <div className="col-lg-4 col-md-4 p-0">
                        <div className="listings-image bg-img4">
                          <img
                            src="/images/listings/listings12.jpg"
                            alt="image"
                          />
                          <a href="#" className="bookmark-save">
                            <i className="flaticon-heart"></i>
                          </a>
                          <a href="#" className="category">
                            <i className="flaticon-cooking"></i>
                          </a>
                          <Link
                            href="/single-listings"
                            className="link-btn"
                          ></Link>
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
                          <div
                            className="
                            d-flex
                            align-items-center
                            justify-content-between
                          "
                          >
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
                              <a href="#">
                                <i className="flaticon-furniture-and-household"></i>
                                Restaurant
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <i className="flaticon-pin"></i> New York, USA
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="single-listings-item">
                    <div className="row m-0">
                      <div className="col-lg-4 col-md-4 p-0">
                        <div className="listings-image bg-img6">
                          <img
                            src="/images/listings/listings17.jpg"
                            alt="image"
                          />
                          <a href="#" className="bookmark-save">
                            <i className="flaticon-heart"></i>
                          </a>
                          <a href="#" className="category">
                            <i className="flaticon-cooking"></i>
                          </a>
                          <Link
                            href="/single-listings"
                            className="link-btn"
                          ></Link>
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
                              Thai Me Up Restaurant
                            </Link>
                          </h3>
                          <div
                            className="
                            d-flex
                            align-items-center
                            justify-content-between
                          "
                          >
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
                              <a href="#">
                                <i className="flaticon-furniture-and-household"></i>
                                Restaurant
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <i className="flaticon-pin"></i> New York, USA
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="single-listings-item">
                    <div className="row m-0">
                      <div className="col-lg-4 col-md-4 p-0">
                        <div className="listings-image bg-img5">
                          <img
                            src="/images/listings/listings16.jpg"
                            alt="image"
                          />
                          <a href="#" className="bookmark-save">
                            <i className="flaticon-heart"></i>
                          </a>
                          <a href="#" className="category">
                            <i className="flaticon-cooking"></i>
                          </a>
                          <Link
                            href="/single-listings"
                            className="link-btn"
                          ></Link>
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
                              Skyview Shopping Complex
                            </Link>
                          </h3>
                          <div
                            className="
                            d-flex
                            align-items-center
                            justify-content-between
                          "
                          >
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
                              <a href="#">
                                <i className="flaticon-shopping-bags"></i>
                                Shopping
                              </a>
                            </li>
                            <li>
                              <a href="#">
                                <i className="flaticon-pin"></i> Seattle, USA
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="pagination-area text-center">
                    <a href="#" className="prev page-numbers">
                      <i className="bx bx-chevrons-left"></i>
                    </a>
                    <span className="page-numbers current" aria-current="page">
                      1
                    </span>
                    <a href="#" className="page-numbers">
                      2
                    </a>
                    <a href="#" className="page-numbers">
                      3
                    </a>
                    <a href="#" className="page-numbers">
                      4
                    </a>
                    <a href="#" className="next page-numbers">
                      <i className="bx bx-chevrons-right"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerticalListingsWithLeftSidebar;
