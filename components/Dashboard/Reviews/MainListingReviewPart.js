import ErrorSpan from "../../ErrorSpan";

const MainListingReviewPart = ({
  stars,
  handleChangeStars,
  description,
  handleDescriptionChange,
}) => {
  return (
    <>
      <div className="col-lg-12 col-md-12">
        <div className="sub-ratings">
          <div className="row">
            {stars.map((option) => (
              <div
                className="col-lg-4 col-md-4 col-6 col-sm-6"
                key={option.key}
              >
                <div className="add-sub-rating">
                  <h4>{option.title} *</h4>
                  <div className="cleanliness-rating">
                    <input
                      type="radio"
                      id={option.key + "Star5"}
                      name={option.key}
                      value="5"
                      onChange={() => handleChangeStars(5, option.key)}
                      checked={option.value == 5}
                    />
                    <label htmlFor={option.key + "Star5"}></label>
                    <input
                      type="radio"
                      id={option.key + "Star4"}
                      name={option.key}
                      value="4"
                      onChange={() => handleChangeStars(4, option.key)}
                      checked={option.value == 4}
                    />
                    <label htmlFor={option.key + "Star4"}></label>
                    <input
                      type="radio"
                      id={option.key + "Star3"}
                      name={option.key}
                      value="3"
                      onChange={() => handleChangeStars(3, option.key)}
                      checked={option.value == 3}
                    />
                    <label htmlFor={option.key + "Star3"}></label>
                    <input
                      type="radio"
                      id={option.key + "Star2"}
                      name={option.key}
                      value="2"
                      onChange={() => handleChangeStars(2, option.key)}
                      checked={option.value == 2}
                    />
                    <label htmlFor={option.key + "Star2"}></label>
                    <input
                      type="radio"
                      id={option.key + "Star1"}
                      name={option.key}
                      value="1"
                      onChange={() => handleChangeStars(1, option.key)}
                      checked={option.value == 1}
                    />
                    <label htmlFor={option.key + "Star1"}></label>
                  </div>
                  <ErrorSpan error={option.error} className="d-block" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-lg-12 col-md-12">
        <div className="form-group">
          <textarea
            placeholder="Your review"
            className="form-control"
            cols="30"
            rows="6"
            value={description}
            onInput={handleDescriptionChange}
          ></textarea>
        </div>
      </div>
    </>
  );
};

export default MainListingReviewPart;
