import {
  autoMultiEnding,
  generateProfileFilePath,
  getFilePath,
} from "../../../utils";
import STATIC from "../../../static";
import StarRating from "../../StarRating";

const OwnerInfo = ({
  data,
  countItemsType = "for rental",
  title = "Owner",
}) => {
  return (
    <div className="listings-widget listings_author">
      <h3>{title}</h3>

      <div className="author">
        <div className="d-flex align-items-center">
          <img
            src={generateProfileFilePath(data.userPhoto)}
            alt={data.userName}
          />
          <div className="title">
            <h4>
              <a href="#">{data.userName}</a>
            </h4>
            <span style={{ color: "#666666" }}>
              {data.userCountItems}{" "}
              {autoMultiEnding(data.userCountItems, "item")} {countItemsType}
            </span>
          </div>
        </div>
      </div>

      <div className="rating-section">
        <StarRating
          averageRating={data.userAverageRating ?? 0}
          commentCount={data.userCommentCount ?? 0}
          centerAlign={true}
          countClass="rating-count"
          pointsValue={true}
        />
      </div>
    </div>
  );
};

export default OwnerInfo;
