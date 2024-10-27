import Link from "next/link";
import {
  activateAuthPopup,
  generateProfileFilePath,
  getListingImageByType,
  moneyFormatVisual,
} from "../../utils";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import StarRating from "../StarRating";
import { changeListingFavorite } from "../../services";
import { useContext, useState } from "react";
import { IndiceContext } from "../../contexts";

const ListingItem = ({ listing: prevListing, hovered = false }) => {
  const [listing, setListing] = useState({ ...prevListing });
  const { authToken, sessionUser } = useContext(IndiceContext);

  const handleChangeFavorite = async (e) => {
    e.preventDefault();
    if (sessionUser) {
      const favorite = await changeListingFavorite(listing.id, authToken);
      setListing((prev) => ({ ...prev, favorite }));
    } else {
      activateAuthPopup();
    }
  };

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
                    href={`/listings/${listing.id}/`}
                    className="link-btn"
                  ></Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {images.length <= 1 && (
          <Link href={`/listings/${listing.id}/`} className="link-btn"></Link>
        )}

        <a
          href="#"
          className={`bookmark-save ${listing.favorite ? "checked" : ""}`}
          onClick={handleChangeFavorite}
        >
          <i className="flaticon-heart"></i>
        </a>
      </div>

      <div className="listings-content">
        <div
          className="author row-dots-end"
          style={{ maxWidth: "calc(100% - 40px)" }}
        >
          <Link href={`/owner-listings/${listing.userId}/`}>
            <div className="d-flex align-items-center">
              <img
                src={generateProfileFilePath(listing.userPhoto)}
                alt="image"
              />
              <span className="row-dots-end">{listing.userName}</span>
            </div>
          </Link>
        </div>
        <ul className="listings-meta">
          <li>
            <Link
              href={`/listings/?categories=${encodeURIComponent(
                listing.categoryName ?? listing.otherCategory
              )}`}
            >
              <i className="flaticon-furniture-and-household"></i>
              <span>{listing.categoryName ?? listing.otherCategory}</span>
            </Link>
          </li>
          <li>
            <Link
              href={`/listings/?cities=${encodeURIComponent(listing.city)}`}
            >
              <i className="flaticon-pin"></i>
              <span>{listing.city}</span>
            </Link>
          </li>
        </ul>

        <h3 className="row-dots-end">
          <Link className="row-dots-end" href={`/listings/${listing.id}/`}>
            {listing.name}
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
          <StarRating
            averageRating={listing["ownerAverageRating"] ?? 0}
            commentCount={listing["ownerCommentCount"] ?? 0}
            emptyMaxWidth="120px"
          />

          <div className="price">
            Price <span>{moneyFormatVisual(listing.price)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingItem;
