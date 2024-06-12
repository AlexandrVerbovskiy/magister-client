import { autoMultiEnding } from "../utils";

const StarRating = ({
  averageRating,
  commentCount,
  checked = false,
  countClass = "count",
  pointsValue = false,
  centerAlign = false,
}) => {
  return (
    <div className={`rating ${centerAlign ? "d-flex align-items-center" : ""}`}>
      {[1, 2, 3, 4, 5].map((value) => {
        let className = "bx-star";

        if (value + 0.25 < averageRating) {
          className = "bxs-star-half";
        }

        if (value + 0.75 < averageRating) {
          className = "bxs-star";
        }

        return (
          <i
            key={value}
            className={`bx ${className} ${checked ? "checked" : ""}`}
          ></i>
        );
      })}

      {pointsValue && (
        <span className="overall-rating">{averageRating.toFixed(1)}</span>
      )}

      <span className={countClass}>
        ({commentCount}{pointsValue && ` ${autoMultiEnding(commentCount, "review")}`})
      </span>
    </div>
  );
};

export default StarRating;
