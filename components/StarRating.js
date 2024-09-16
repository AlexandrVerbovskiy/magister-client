import { autoMultiEnding } from "../utils";

const StarRating = ({
  averageRating,
  commentCount = null,
  checked = false,
  countClass = "count",
  pointsValue = false,
  centerAlign = false,
  checkedOnlyActive = false,
  uncheckedStarClassName = "bx-star",
  emptyMaxWidth = null,
  needCommentsCount = true,
  commentName = "item",
}) => {
  if (!commentCount) {
    return (
      <div
        className="no-comments-rating"
        style={emptyMaxWidth ? { maxWidth: emptyMaxWidth } : {}}
      >
        No reviews added to this {commentName}
      </div>
    );
  }

  return (
    <div className={`rating ${centerAlign ? "d-flex align-items-center" : ""}`}>
      {[0, 1, 2, 3, 4].map((value) => {
        let needChecked = checked;
        let className = uncheckedStarClassName;

        if (needChecked && checkedOnlyActive) {
          needChecked = false;
        }

        if (value + 0.25 < averageRating) {
          className = "bxs-star-half";
          needChecked = true;
        }

        if (value + 0.75 < averageRating) {
          className = "bxs-star";
          needChecked = true;
        }

        return (
          <i
            key={value}
            className={`bx ${className} ${needChecked ? "checked" : ""}`}
          ></i>
        );
      })}

      {pointsValue && (
        <span className="overall-rating">{averageRating.toFixed(1)}</span>
      )}

      {needCommentsCount && (
        <span className={countClass}>
          ({commentCount}
          {pointsValue && ` ${autoMultiEnding(commentCount, "review")}`})
        </span>
      )}
    </div>
  );
};

export default StarRating;
