import MainReviewPart from "./MainReviewPart";
import { useContext, useState } from "react";
import { IndiceContext } from "../../../contexts";
import { validateBigText } from "../../../utils";
import ErrorSpan from "../../ErrorSpan";
import OwnerInfo from "../../Order/OrderApprovementParts/OwnerInfo";

const options = [
  { title: "Quality", key: "quality" },
  { title: "Listing accuracy", key: "listingAccuracy" },
  { title: "Utility", key: "utility" },
  { title: "Condition", key: "condition" },
  { title: "Performance", key: "performance" },
  { title: "Location", key: "location" },
];

const UserReviewForm = ({ data, onSubmit, goBack = null }) => {
  const baseOptions = options.map((option) => ({
    ...option,
    value: 0,
  }));
  const [starOptions, setStarOptions] = useState(baseOptions);
  const [description, setDescription] = useState("");
  const [leaveFeedback, setLeaveFeedback] = useState("");
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const { error: mainError } = useContext(IndiceContext);

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
    
    const values = {};
    starOptions.forEach((element) => {
      if (!element.value) {
        setError(element.title + " is required");
      }

      values[element.key] = element.value;
    });

    if (description.trim().length < 1) {
      setError("Description is required");
      return;
    }

    if (validateBigText(description.trim()) !== true) {
      setError(validateBigText(description.trim()));
      return;
    }

    try {
      setDisabled(true);
      await onSubmit({
        values,
        description,
        leaveFeedback: leaveFeedback.trim(),
      });
    } catch (e) {
      mainError.set(e.message);
    } finally {
      setDisabled(false);
    }
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
                      Submit
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
