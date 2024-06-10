import Link from "next/link";
import { getFilePath, getListingImageByType, moneyFormat } from "../../utils";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import STATIC from "../../static";
import StarRating from "../StarRating";

const ListingItem = ({ listing, hovered = false }) => {
  const images = listing.images ?? [];

  return (
    <div
      className={`single-listings-box ${hovered ? "hovered" : ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div className="listings-image">
        {images.length == 1 && (
          <img
            src={getListingImageByType(images[0].link, images[0].type)}
            alt="image"
          />
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

        {images.length <= 1 && (
          <Link href={`/listing/${listing.id}`} className="link-btn"></Link>
        )}

        <a href="#" className="bookmark-save">
          <i className="flaticon-heart"></i>
        </a>

      </div>

      <div className="listings-content">
        <div
          className="author row-dots-end"
          style={{ maxWidth: "calc(100% - 40px)" }}
        >
          <Link href={`/owner-listing-list/${listing.userId}`}>
            <div className="d-flex align-items-center">
              <img
                src={
                  listing.userPhoto
                    ? getFilePath(listing.userPhoto)
                    : STATIC.DEFAULT_PHOTO_LINK
                }
                alt="image"
              />
              <span className="row-dots-end">{listing.userName}</span>
            </div>
          </Link>
        </div>
        <ul className="listings-meta">
          <li>
            <Link href={`/listing-list?categories=${listing.categoryName}`}>
              <i className="flaticon-furniture-and-household"></i>
              <span>{listing.categoryName}</span>
            </Link>
          </li>
          <li>
            <Link href={`/listing-list?cities=${listing.city}`}>
              <i className="flaticon-pin"></i>
              <span>{listing.city}</span>
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
          <StarRating
            averageRating={listing["averageRating"]??0}
            commentCount={listing["commentCount"]??0}
          />

          <div className="price">
            Per Day <span>${moneyFormat(listing.pricePerDay)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingItem;
