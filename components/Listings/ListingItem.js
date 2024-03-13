import Link from "next/link";
import { getFilePath, getListingImageByType } from "../../utils";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

const ListingItem = ({ listing, hovered = false }) => {
  const images = listing.images ?? [];

  return (
    <div className={`single-listings-box w-100 ${hovered ? "hovered" : ""}`}>
      <div className="listings-image">
        {images.length == 1 && (
          <>
            <img
              src={getListingImageByType(images[0].link, images[0].type)}
              alt="image"
            />
            <Link href={`/listing/${listing.id}`} className="link-btn"></Link>
          </>
        )}

        {images.length > 1 && (
          <Swiper
            loop={true}
            navigation={true}
            modules={[Navigation]}
            className="listings-image-slides"
          >
            {images.map((img) => (
              <SwiperSlide key={img.id}>
                <div className="single-image">
                  <img
                    src={getListingImageByType(img.link, img.type)}
                    alt="image"
                  />
                  <Link
                    href={`/listing/${listing.id}`}
                    className="link-btn"
                  ></Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

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
            <img src={getFilePath(listing.userPhoto)} alt="image" />
            <span>{listing.userName}</span>
          </div>
        </div>
        <ul className="listings-meta">
          <li>
            <Link href={`/listing-list?categories=${listing.categoryName}`}>
              <i className="flaticon-furniture-and-household"></i>
              {listing.categoryName}
            </Link>
          </li>
          <li>
            <Link href={`/listing-list?cities=${listing.city}`}>
              <i className="flaticon-pin"></i>
              {listing.city}
            </Link>
          </li>
        </ul>
        <h3>
          <Link href={`/listing/${listing.id}`}>{listing.name}</Link>
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
            Start From <span>${listing.pricePerDay}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingItem;
