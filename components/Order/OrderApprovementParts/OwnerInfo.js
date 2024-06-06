import { autoMultiEnding, getFilePath } from "../../../utils";
import STATIC from "../../../static";

const OwnerInfo = ({ data }) => {
  return (
    <div className="listings-widget listings_author">
      <h3>Owner</h3>

      <div className="author">
        <div className="d-flex align-items-center">
          <img
            src={
              data.userPhoto
                ? getFilePath(data.userPhoto)
                : STATIC.DEFAULT_PHOTO_LINK
            }
            alt={data.userName}
          />
          <div className="title">
            <h4>
              <a href="#">{data.userName}</a>
            </h4>
            <span style={{ color: "#666666" }}>
              {data.userCountItems}{" "}
              {autoMultiEnding(data.userCountItems, "item")} for rental
            </span>
          </div>
        </div>
      </div>

      <div className="rating-section">
        <div className="rating d-flex align-items-center">
          <span className="bx bxs-star checked"></span>
          <span className="bx bxs-star checked"></span>
          <span className="bx bxs-star checked"></span>
          <span className="bx bxs-star checked"></span>
          <span className="bx bxs-star checked"></span>
        </div>
        <span className="overall-rating">
          <b>5.0</b>
        </span>
        <span className="rating-count">
          <a href="#">(5 reviews)</a>
        </span>
      </div>
    </div>
  );
};

export default OwnerInfo;
