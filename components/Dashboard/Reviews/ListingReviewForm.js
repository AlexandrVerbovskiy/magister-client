import MainListingReviewPart from "./MainListingReviewPart";
import { useState } from "react";
import { validateBigText } from "../../../utils";
import ErrorSpan from "../../ErrorSpan";
import ContractDetailsLight from "../../Order/OrderApprovementParts/ContractDetailsLight";
import ItemInfo from "../../Order/OrderApprovementParts/ItemInfo";

const ListingReviewForm = ({
  order,
  onSubmit,
  setCurrentOpenImg,
  starOptions,
  setStarOptions,
  description,
  setDescription,
  goBack = null,
  submitButtonText = "Submit",
  disabled,
}) => {
  const [error, setError] = useState(null);

  const handleChangeValue = (newValue, key) => {
    setError(null);
    setStarOptions((prev) =>
      prev.map((option) =>
        option.key == key
          ? { ...option, error: null, value: newValue }
          : { ...option }
      )
    );
  };

  const handleDescriptionChange = (e) => {
    setError(null);
    setDescription(e.target.value);
  };

  const handleSubmit = async () => {
    if (disabled) {
      return;
    }

    let newStarOptions = starOptions.map((option) => ({
      ...option,
      error: option.value ? null : `${option.title} required field!`,
    }));

    setStarOptions(newStarOptions);

    if (newStarOptions.find((option) => option.error)) {
      return;
    }

    if (description.trim().length < 1) {
      setError("Description is required");
      return;
    }

    if (validateBigText(description.trim()) !== true) {
      setError(validateBigText(description.trim()));
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
        <div className="listings-sidebar">
          <ContractDetailsLight
            fee={order.renterFee}
            price={order.offerPrice}
            startDate={order.offerStartDate}
            finishDate={order.offerFinishDate}
          />

          <ItemInfo
            setCurrentOpenImg={setCurrentOpenImg}
            listing={{
              id: order.listingId,
              name: order.listingName,
              listingImages: order.listingImages,
              averageRating: order.ownerAverageRating,
              commentCount: order.ownerCommentCount,
            }}
          />
        </div>
      </div>
      <div className="col-lg-8 col-md-12">
        <div className="listings-details-desc">
          <div id="add-review">
            <div className="review-form-wrapper">
              <h3>Add a Review</h3>
              <p className="comment-notes">
                Your email address will not be published. Required fields are
                marked *
              </p>

              <form>
                <div className="row">
                  <MainListingReviewPart
                    stars={starOptions}
                    handleChangeStars={handleChangeValue}
                    description={description}
                    handleDescriptionChange={handleDescriptionChange}
                  />

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

export default ListingReviewForm;
