import MainReviewPart from "./MainReviewPart";
import { useContext, useState } from "react";
import { IndiceContext } from "../../../contexts";
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
}) => {
  const [error, setError] = useState(null);

  const handleChangeValue = (newValue, key) => {
    setError(null);
    setStarOptions((prev) =>
      prev.map((option) =>
        option.key == key ? { ...option, value: newValue } : { ...option }
      )
    );
  };

  const handleDescriptionChange = (e) => {
    setError(null);
    setDescription(e.target.value);
  };

  const handleLeaveFeedbackChange = (e) => {
    setError(null);
    setLeaveFeedback(e.target.value);
  };

  const handleSubmit = async () => {
    if (disabled) {
      return;
    }

    for (let i = 0; i < starOptions.length; i++) {
      const element = starOptions[i];
      if (!element.value) {
        setError(element.title + " is required");
        return;
      }
    }

    if (description.trim().length < 1) {
      setError("Description is required");
      return;
    }

    if (validateBigText(description.trim()) !== true) {
      setError(validateBigText(description.trim()));
      return;
    }

    console.log("test");

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
        <div className="listings-sidebar">
          <OwnerInfo
            data={{
              userName: data.userName,
              userPhoto: data.userPhoto,
              userCountItems: +data.userCountItems,
            }}
          />
        </div>
      </div>
      <div className="col-lg-8 col-md-12">
        <div className="listings-details-desc">
          <div id="add-review">
            <div className="review-form-wrapper">
              <h3>Add a Public Review</h3>
              <p className="comment-notes">
                Your email address will not be published. Required fields are
                marked *
              </p>

              <form>
                <div className="row">
                  <MainReviewPart
                    stars={starOptions}
                    handleChangeStars={handleChangeValue}
                    description={description}
                    handleDescriptionChange={handleDescriptionChange}
                  />
                </div>
              </form>

              <h3>Leave Private Feedback</h3>
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

                  {error && (
                    <div className="w-full form-group mb-0">
                      <div
                        className="is-invalid"
                        style={{ marginTop: "-25px" }}
                      >
                        <ErrorSpan error={error} />
                      </div>
                    </div>
                  )}

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
