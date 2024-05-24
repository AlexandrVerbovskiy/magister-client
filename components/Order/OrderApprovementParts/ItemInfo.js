import { getListingImageByType } from "../../../utils";

const ItemInfo = ({ setCurrentOpenImg, listing }) => {
  const firstListingImagePhoto = listing.listingImages
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
    <div className="listings-widget listings_author item_info">
      <h3>Item</h3>

      <div
        style={{ cursor: "zoom-in" }}
        onClick={() => setCurrentOpenImg(firstListingImagePhotoLink)}
      >
        <div className="single-image-bpx">
          <img src={firstListingImagePhotoLink} alt={`${listing.name} image`} />
        </div>
      </div>

      <div className="title" style={{ fontSize: "20px" }}>
        <h4>
          <a href="#">{listing.name}</a>
        </h4>
      </div>

      <div className="rating-section" style={{ marginTop: "15px" }}>
        <div className="rating d-flex align-items-center">
          <span className="bx bxs-star checked"></span>
          <span className="bx bxs-star checked"></span>
          <span className="bx bxs-star checked"></span>
          <span className="bx bxs-star checked"></span>
          <span className="bx bxs-star checked"></span>
        </div>
        <span className="rating-count">(45)</span>
      </div>
    </div>
  );
};

export default ItemInfo;
