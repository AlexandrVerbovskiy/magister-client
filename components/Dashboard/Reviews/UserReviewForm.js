import MainUserReviewPart from "./MainUserReviewPart";
import { useState } from "react";
import { validateBigText } from "../../../utils";
import ErrorSpan from "../../ErrorSpan";
import OwnerInfo from "../../Order/OrderApprovementParts/OwnerInfo";

const UserReviewForm = ({
  data,
  onSubmit,
  goBack = null,
  starOptions,
  setStarOptions,
  description,
  setDescription,
  leaveFeedback,
  setLeaveFeedback,
  submitButtonText = "Submit",
  disabled,
  type,
}) => {
  const [descriptionError, setDescriptionError] = useState(null);

  const handleChangeValue = (newValue, key) => {
    setStarOptions((prev) =>
      prev.map((option) =>
        option.key == key
          ? { ...option, error: null, value: newValue }
          : { ...option }
      )
    );
  };

  const handleDescriptionChange = (e) => {
    setDescriptionError(null);
    setDescription(e.target.value);
  };

  const handleLeaveFeedbackChange = (e) => {
    setLeaveFeedback(e.target.value);
  };

  const handleSubmit = async () => {
    if (disabled) {
      return;
    }

    let newStarOptions = starOptions.map((option) => ({
      ...option,
      error: option.value ? null : `${option.title} required field!`,
    }));

    let hasError = false;

    if (newStarOptions.find((option) => option.error)) {
      hasError = true;
    }

    setStarOptions(newStarOptions);

    if (description.trim().length < 1) {
      setDescriptionError("Review description is required");
      hasError = true;
    } else if (validateBigText(description.trim()) !== true) {
      setDescriptionError(validateBigText(description.trim()));
      hasError = true;
    }

    if (hasError) {
      return;
    }

    await onSubmit();
  };

  const handleGoBackClick = () => {
    if (disabled) {
      return;
    }

    goBack();
  };

  return (
    <div className="row">
      <div className="col-lg-4 col-md-12">
        <div className="listings-sidebar mt-0">
          <OwnerInfo
            data={{
              userName: data.userName,
              userPhoto: data.userPhoto,
              userCountItems: +data.userCountItems,
              userAverageRating: data.userAverageRating,
              userCommentCount: data.userCommentCount,
            }}
            title={type == "renter" ? "Renter" : "Owner"}
          />
        </div>
      </div>
      <div className="col-lg-8 col-md-12">
        <div className="listings-details-desc mt-0">
          <div id="add-review">
            <div className="review-form-wrapper">
              <h3>Add a Public Review</h3>
              <p className="comment-notes">
                Your email address will not be published. Required fields are
                marked *
              </p>

              <form>
                <div className="row">
                  <MainUserReviewPart
                    stars={starOptions}
                    handleChangeStars={handleChangeValue}
                    description={description}
                    handleDescriptionChange={handleDescriptionChange}
                    descriptionError={descriptionError}
                  />
                </div>
              </form>

              <h3 className="mt-2">Leave Private Feedback</h3>
              <p className="comment-notes">
                Share your feedback privately. Your comments will only be
                visible to the owner.
              </p>

              <form>
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <textarea
                        placeholder="Your review"
                        className="form-control"
                        cols="30"
                        rows="6"
                        value={leaveFeedback}
                        onInput={handleLeaveFeedbackChange}
                      ></textarea>
                    </div>
                  </div>

                  <div
                    className="col-lg-12 col-md-12 d-flex"
                    style={
                      goBack
                        ? { justifyContent: "space-between" }
                        : { justifyContent: "flex-end" }
                    }
                  >
                    {goBack && (
                      <button
                        disabled={disabled}
                        type="button"
                        onClick={handleGoBackClick}
                      >
                        Go Back
                      </button>
                    )}

                    <button
                      disabled={disabled}
                      type="button"
                      onClick={handleSubmit}
                      className="submit"
                    >
                      {submitButtonText}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReviewForm;
