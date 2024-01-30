import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Sidebar from "../Listings/Sidebar";

const ListingsWithMap = () => {
  return (
    <>
      <div className="listings-area ptb-100">
        <div className="container-fluid">
          <div className="row m-0">
            <div className="col-xl-8 col-lg-12 col-md-12 p-0">
              <div className="row">
                <div className="col-lg-4 col-md-12">
                  <Sidebar />
                </div>

                <div className="col-lg-8 col-md-12">
                  <div className="all-listings-list">
                    <div className="listings-grid-sorting row align-items-center">
                      <div className="col-lg-5 col-md-6 result-count">
                        <p>
                          <span className="count">9</span> Results
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
                      <div className="col-xl-6 col-lg-6 col-md-6">
                        <div className="single-listings-box">
                          <div className="listings-image">
                            <img
                              src="/images/listings/listings1.jpg"
                              alt="image"
                            />
                            <Link
                              href="/single-listings"
                              className="link-btn"
                            ></Link>
                            <a href="#" className="bookmark-save">
                              <i className="flaticon-heart"></i>
                            </a>
                            <a href="#" className="category">
                              <i className="flaticon-cooking"></i>
                            </a>
                          </div>

                          <div className="listings-content">
                            <div className="author">
                              <div className="d-flex align-items-center">
                                <img src="/images/user1.jpg" alt="image" />
                                <span>Taylor</span>
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
                            <h3>
                              <Link href="/product-details">
                                Chipotle Mexican Grill
                              </Link>
                            </h3>
                            <span className="status">
                              <i className="flaticon-save"></i> Open Now
                            </span>
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
                          </div>
                        </div>
                      </div>

                      <div className="col-xl-6 col-lg-6 col-md-6">
                        <div className="single-listings-box">
                          <div className="listings-image">
                            <Swiper
                              loop={true}
                              navigation={true}
                              modules={[Navigation]}
                              className="listings-image-slides"
                            >
                              <SwiperSlide>
                                <div className="single-image">
                                  <img
                                    src="/images/listings/listings2.jpg"
                                    alt="image"
                                  />
                                  <Link
                                    href="/single-listings"
                                    className="link-btn"
                                  ></Link>
                                </div>
                              </SwiperSlide>

                              <SwiperSlide>
                                <div className="single-image">
                                  <img
                                    src="/images/listings/listings4.jpg"
                                    alt="image"
                                  />
                                  <Link
                                    href="/single-listings"
                                    className="link-btn"
                                  ></Link>
                                </div>
                              </SwiperSlide>
                            </Swiper>

                            <a href="#" className="bookmark-save">
                              <i className="flaticon-heart"></i>
                            </a>
                            <a href="#" className="category">
                              <i className="flaticon-cooking"></i>
                            </a>
                          </div>

                          <div className="listings-content">
                            <div className="author">
                              <div className="d-flex align-items-center">
                                <img src="/images/user2.jpg" alt="image" />
                                <span>Sarah</span>
                              </div>
                            </div>
                            <ul className="listings-meta">
                              <li>
                                <a href="#">
                                  <i className="flaticon-furniture-and-household"></i>
                                  Hotel
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  <i className="flaticon-pin"></i> Los Angeles,
                                  USA
                                </a>
                              </li>
                            </ul>
                            <h3>
                              <Link href="/single-listings">
                                The Beverly Hills Hotel
                              </Link>
                            </h3>
                            <span className="status">
                              <i className="flaticon-save"></i> Open Now
                            </span>
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
                          </div>
                        </div>
                      </div>

                      <div className="col-xl-6 col-lg-6 col-md-6">
                        <div className="single-listings-box">
                          <div className="listings-image">
                            <img
                              src="/images/listings/listings3.jpg"
                              alt="image"
                            />
                            <Link
                              href="/single-listings"
                              className="link-btn"
                            ></Link>
                            <a href="#" className="bookmark-save">
                              <i className="flaticon-heart"></i>
                            </a>
                            <a href="#" className="category">
                              <i className="flaticon-cooking"></i>
                            </a>
                          </div>

                          <div className="listings-content">
                            <div className="author">
                              <div className="d-flex align-items-center">
                                <img src="/images/user3.jpg" alt="image" />
                                <span>James</span>
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
                                  <i className="flaticon-pin"></i> Bangkok,
                                  Thailand
                                </a>
                              </li>
                            </ul>
                            <h3>
                              <Link href="/single-listings">
                                Central Shopping Center
                              </Link>
                            </h3>
                            <span className="status status-close">
                              <i className="flaticon-save"></i> Close Now
                            </span>
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
                                <i className="bx bxs-star-half"></i>
                                <span className="count">(35)</span>
                              </div>
                              <div className="price">
                                Start From <span>$110</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-xl-6 col-lg-6 col-md-6">
                        <div className="single-listings-box">
                          <div className="listings-image">
                            <Swiper
                              loop={true}
                              navigation={true}
                              modules={[Navigation]}
                              className="listings-image-slides"
                            >
                              <SwiperSlide>
                                <div className="single-image">
                                  <img
                                    src="/images/listings/listings5.jpg"
                                    alt="image"
                                  />
                                  <Link
                                    href="/single-listings"
                                    className="link-btn"
                                  ></Link>
                                </div>
                              </SwiperSlide>

                              <SwiperSlide>
                                <div className="single-image">
                                  <img
                                    src="/images/listings/listings6.jpg"
                                    alt="image"
                                  />
                                  <Link
                                    href="/single-listings"
                                    className="link-btn"
                                  ></Link>
                                </div>
                              </SwiperSlide>
                            </Swiper>

                            <a href="#" className="bookmark-save">
                              <i className="flaticon-heart"></i>
                            </a>
                            <a href="#" className="category">
                              <i className="flaticon-cooking"></i>
                            </a>
                          </div>

                          <div className="listings-content">
                            <div className="author">
                              <div className="d-flex align-items-center">
                                <img src="/images/user4.jpg" alt="image" />
                                <span>Andy</span>
                              </div>
                            </div>
                            <ul className="listings-meta">
                              <li>
                                <a href="#">
                                  <i className="flaticon-cleansing"></i> Beauty
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  <i className="flaticon-pin"></i> Suwanee, USA
                                </a>
                              </li>
                            </ul>
                            <h3>
                              <Link href="/single-listings">
                                Indice Beauty Center
                              </Link>
                            </h3>
                            <span className="status">
                              <i className="flaticon-save"></i> Open Now
                            </span>
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
                                <i className="bx bx-star"></i>
                                <i className="bx bx-star"></i>
                                <span className="count">(15)</span>
                              </div>
                              <div className="price">
                                Start From <span>$100</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-xl-6 col-lg-6 col-md-6">
                        <div className="single-listings-box">
                          <div className="listings-image">
                            <img
                              src="/images/listings/listings7.jpg"
                              alt="image"
                            />
                            <Link
                              href="/single-listings"
                              className="link-btn"
                            ></Link>
                            <a href="#" className="bookmark-save">
                              <i className="flaticon-heart"></i>
                            </a>
                            <a href="#" className="category">
                              <i className="flaticon-cooking"></i>
                            </a>
                          </div>

                          <div className="listings-content">
                            <div className="author">
                              <div className="d-flex align-items-center">
                                <img src="/images/user3.jpg" alt="image" />
                                <span>James</span>
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
                                  <i className="flaticon-pin"></i> Francisco,
                                  USA
                                </a>
                              </li>
                            </ul>
                            <h3>
                              <Link href="/single-listings">
                                The Mad Made Grill
                              </Link>
                            </h3>
                            <span className="status">
                              <i className="flaticon-save"></i> Open Now
                            </span>
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
                          </div>
                        </div>
                      </div>

                      <div className="col-xl-6 col-lg-6 col-md-6">
                        <div className="single-listings-box">
                          <div className="listings-image">
                            <Swiper
                              loop={true}
                              navigation={true}
                              modules={[Navigation]}
                              className="listings-image-slides"
                            >
                              <SwiperSlide>
                                <div className="single-image">
                                  <img
                                    src="/images/listings/listings4.jpg"
                                    alt="image"
                                  />
                                  <Link
                                    href="/single-listings"
                                    className="link-btn"
                                  ></Link>
                                </div>
                              </SwiperSlide>

                              <SwiperSlide>
                                <div className="single-image">
                                  <img
                                    src="/images/listings/listings2.jpg"
                                    alt="image"
                                  />
                                  <Link
                                    href="/single-listings"
                                    className="link-btn"
                                  ></Link>
                                </div>
                              </SwiperSlide>
                            </Swiper>

                            <a href="#" className="bookmark-save">
                              <i className="flaticon-heart"></i>
                            </a>
                            <a href="#" className="category">
                              <i className="flaticon-cooking"></i>
                            </a>
                          </div>

                          <div className="listings-content">
                            <div className="author">
                              <div className="d-flex align-items-center">
                                <img src="/images/user2.jpg" alt="image" />
                                <span>Sarah</span>
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
                            <h3>
                              <Link href="/single-listings">
                                The Beverly Hills Hotel
                              </Link>
                            </h3>
                            <span className="status">
                              <i className="flaticon-save"></i> Open Now
                            </span>
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
                          </div>
                        </div>
                      </div>

                      <div className="col-xl-6 col-lg-6 col-md-6">
                        <div className="single-listings-box">
                          <div className="listings-image">
                            <img
                              src="/images/listings/listings13.jpg"
                              alt="image"
                            />
                            <Link
                              href="/single-listings"
                              className="link-btn"
                            ></Link>
                            <a href="#" className="bookmark-save">
                              <i className="flaticon-heart"></i>
                            </a>
                            <a href="#" className="category">
                              <i className="flaticon-cooking"></i>
                            </a>
                          </div>

                          <div className="listings-content">
                            <div className="author">
                              <div className="d-flex align-items-center">
                                <img src="/images/user3.jpg" alt="image" />
                                <span>James</span>
                              </div>
                            </div>
                            <ul className="listings-meta">
                              <li>
                                <a href="#">
                                  <i className="flaticon-shopping-bags"></i>
                                  Fitness
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  <i className="flaticon-pin"></i> Bangkok,
                                  Thailand
                                </a>
                              </li>
                            </ul>
                            <h3>
                              <Link href="/single-listings">
                                Power House Gym
                              </Link>
                            </h3>
                            <span className="status status-close">
                              <i className="flaticon-save"></i> Close Now
                            </span>
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
                                <i className="bx bxs-star-half"></i>
                                <span className="count">(35)</span>
                              </div>
                              <div className="price">
                                Start From <span>$110</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-xl-6 col-lg-6 col-md-6">
                        <div className="single-listings-box">
                          <div className="listings-image">
                            <Swiper
                              loop={true}
                              navigation={true}
                              modules={[Navigation]}
                              className="listings-image-slides"
                            >
                              <SwiperSlide>
                                <div className="single-image">
                                  <img
                                    src="/images/listings/listings14.jpg"
                                    alt="image"
                                  />
                                  <Link
                                    href="/single-listings"
                                    className="link-btn"
                                  ></Link>
                                </div>
                              </SwiperSlide>

                              <SwiperSlide>
                                <div className="single-image">
                                  <img
                                    src="/images/listings/listings15.jpg"
                                    alt="image"
                                  />
                                  <Link
                                    href="/single-listings"
                                    className="link-btn"
                                  ></Link>
                                </div>
                              </SwiperSlide>
                            </Swiper>

                            <a href="#" className="bookmark-save">
                              <i className="flaticon-heart"></i>
                            </a>
                            <a href="#" className="category">
                              <i className="flaticon-cooking"></i>
                            </a>
                          </div>

                          <div className="listings-content">
                            <div className="author">
                              <div className="d-flex align-items-center">
                                <img src="/images/user4.jpg" alt="image" />
                                <span>Andy</span>
                              </div>
                            </div>
                            <ul className="listings-meta">
                              <li>
                                <a href="#">
                                  <i className="flaticon-cleansing"></i> Beauty
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  <i className="flaticon-pin"></i> Suwanee, USA
                                </a>
                              </li>
                            </ul>
                            <h3>
                              <Link href="/single-listings">
                                Divine Beauty Parlour & Spa
                              </Link>
                            </h3>
                            <span className="status">
                              <i className="flaticon-save"></i> Open Now
                            </span>
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
                                <i className="bx bx-star"></i>
                                <i className="bx bx-star"></i>
                                <span className="count">(15)</span>
                              </div>
                              <div className="price">
                                Start From <span>$100</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-xl-12 col-lg-12 col-md-12">
                        <div className="pagination-area text-center">
                          <a href="#" className="prev page-numbers">
                            <i className="bx bx-chevrons-left"></i>
                          </a>
                          <span
                            className="page-numbers current"
                            aria-current="page"
                          >
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

            <div className="col-xl-4 col-lg-12 col-md-12 p-0">
              <div className="map-container fw-map side-full-map">
                <div id="main-full-map">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8385385572983!2d144.95358331584498!3d-37.81725074201705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4dd5a05d97%3A0x3e64f855a564844d!2s121%20King%20St%2C%20Melbourne%20VIC%203000%2C%20Australia!5e0!3m2!1sen!2sbd!4v1612419490850!5m2!1sen!2sbd"></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingsWithMap;
