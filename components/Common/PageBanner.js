import React from "react";
import Link from "next/link";

const PageBanner = ({ pageTitle, pageName, imgSrc = null, dopLinks = [] }) => {
  return (
    <>
      <div
        className="page-title-area page-title-bg2 position-relative"
        style={imgSrc ? { backgroundImage: `url(${imgSrc})` } : {}}
      >
        <div className="container">
          <div
            className="page-title-content"
            style={{ zIndex: "9", position: "relative" }}
          >
            <h2>{pageTitle}</h2>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              {dopLinks.map((link) => (
                <li key={link.link}>
                  <Link href={link.link}>{link.title}</Link>
                </li>
              ))}
              <li>{pageName}</li>
            </ul>
          </div>
        </div>
        <div className="background-image-black"></div>
      </div>
    </>
  );
};

export default PageBanner;
