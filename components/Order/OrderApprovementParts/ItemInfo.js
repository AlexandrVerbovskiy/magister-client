import { getListingImageByType } from "../../../utils";
import StarRating from "../../StarRating";

const ItemInfo = ({ setCurrentOpenImg, listing, wrapperClassName = "" }) => {
  const firstListingImagePhoto = listing?.listingImages
    ? listing.listingImages[0]
    : null;

  if (!firstListingImagePhoto) {
    return <></>;
  }

  const firstListingImagePhotoLink = getListingImageByType(
    firstListingImagePhoto.link,
    firstListingImagePhoto.type
  );

  if (!firstListingImagePhotoLink) {
    return <></>;
  }

  return (
    <div
      className={"listings-widget listings_author item_info " + wrapperClassName}
    >
      <h3>Item</h3>

      <div
        style={{ cursor: "zoom-in" }}
        onClick={() => setCurrentOpenImg(firstListingImagePhotoLink)}
      >
        <div className="single-image-bpx">
          <img src={firstListingImagePhotoLink} alt={`${listing.name} image`} />
        </div>
      </div>

      <div
        className="title row-dots-end"
        style={{ fontSize: "20px", marginBottom: "15px" }}
      >
        <h4 className="row-dots-end">
          <a href={`/listings/${listing.id}`}>{listing.name}</a>
        </h4>
      </div>

      <div className="rating-section">
        <StarRating
          averageRating={listing["ownerAverageRating"] ?? 0}
          commentCount={listing["ownerCommentCount"] ?? 0}
          centerAlign={true}
          countClass="rating-count"
        />
      </div>
    </div>
  );
};

export default ItemInfo;
