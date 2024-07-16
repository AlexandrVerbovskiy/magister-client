import React from "react";
import Link from "next/link";

const PageHeader = () => {
  return (
    <>
      <div className="page-title-bg map-home-area">
        <div id="main-full-map" className="full-width-map">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8385385572983!2d144.95358331584498!3d-37.81725074201705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4dd5a05d97%3A0x3e64f855a564844d!2s121%20King%20St%2C%20Melbourne%20VIC%203000%2C%20Australia!5e0!3m2!1sen!2sbd!4v1612419490850!5m2!1sen!2sbd"></iframe>
        </div>

        <form>
          <div className="row m-0 align-items-center">
            <div className="col-lg-4 col-md-12 p-0">
              <div className="form-group">
                <label>
                  <i className="flaticon-search"></i>
                </label>
                <input
                  name="category"
                  type="text"
                  className="form-control"
                  placeholder="Search by category"
                />
              </div>
            </div>

            <div className="col-lg-3 col-md-6 p-0">
              <div className="form-group">
                <label>
                  <i className="flaticon-pin"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Location"
                  name="location"
                />
              </div>
            </div>

            <div className="col-lg-3 col-md-6 p-0">
              <div className="form-group category-select pagebanner-select-custom">
                <label className="category-icon">
                  <i className="flaticon-category"></i>
                </label>
                <select className="banner-form-select-popularplacefilter">
                  <option>All Categories</option>
                  <option>Restaurants</option>
                  <option>Events</option>
                  <option>Clothing</option>
                  <option>Bank</option>
                  <option>Fitness</option>
                  <option>Bookstore</option>
                  <option>Shopping</option>
                  <option>Hotels</option>
                  <option>Hospitals</option>
                  <option>Culture</option>
                  <option>Beauty</option>
                </select>
              </div>
            </div>

            <div className="col-lg-2 col-md-12 p-0">
              <div className="submit-btn">
                <button type="submit">Search Now</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default PageHeader;
