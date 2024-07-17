const SingleRatingStar = ({
  value,
  count = 0,
  bodyColor = "rgb(248 250 252)",
  emptyMaxWidth = null,
  commentName = "item",
}) => {
  if (!count) {
    return (
      <div
        className="no-comments-rating"
        style={emptyMaxWidth ? { maxWidth: emptyMaxWidth } : {}}
      >
        No reviews added to this {commentName}
      </div>
    );
  }

  if (!value) {
    value = 0;
  }

  return (
    <span className="text-amber-500">
      <svg
        style={{ marginTop: "-5px" }}
        className="w-4 h-4 shrink-0 fill-current mr-0.5 inline"
        viewBox="0 0 16 16"
      >
        <path d="M10 5.934L8 0 6 5.934H0l4.89 3.954L2.968 16 8 12.223 13.032 16 11.11 9.888 16 5.934z"></path>
      </svg>
      {/*<svg
          className="w-4 h-4 shrink-0 mr-0.5 absolute top-0"
          viewBox="0 0 16 16"
          fill={bodyColor}
        >
          <rect width="16" height="16" x={(value * 16) / 5} y="0"></rect>
        </svg>*/}
      <span className="text-sm text-amber-600">{value.toFixed(1)}</span>
    </span>
  );
};

export default SingleRatingStar;
