import { autoMultiEnding, generateProfileFilePath } from "../../../utils";
import StarRating from "../../StarRating";

const WorkerInfo = ({
  data,
  countItemsType = "completed",
  title = "Worker",
  wrapperClassName = "",
}) => {
  return (
    <div className={"listings-widget listings_author " + wrapperClassName}>
      <h3>{title}</h3>

      <div className="author">
        <div className="d-flex align-items-center">
          <img
            src={generateProfileFilePath(data.userPhoto)}
            alt={data.userName}
          />
          <div className="title row-dots-end">
            <h4 className="row-dots-end">{data.userName}</h4>
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
          commentName="worker"
        />
      </div>
    </div>
  );
};

export default WorkerInfo;
