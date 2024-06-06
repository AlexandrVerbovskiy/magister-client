import MainReviewPart from "./MainReviewPart";
import { useContext, useState } from "react";
import { IndiceContext } from "../../../contexts";
import { validateBigText } from "../../../utils";
import ErrorSpan from "../../ErrorSpan";
import ContractDetailsLight from "../../Order/OrderApprovementParts/ContractDetailsLight";
import ItemInfo from "../../Order/OrderApprovementParts/ItemInfo";

const options = [
  { title: "Punctuality", key: "punctuality" },
  { title: "Communication", key: "communication" },
  { title: "Flexibility", key: "flexibility" },
  { title: "Reliability", key: "reliability" },
  { title: "Kindness", key: "kindness" },
  { title: "General Experience", key: "generalExperience" },
];

const ListingReviewForm = ({
  order,
  onSubmit,
  setCurrentOpenImg,
  goBack = null,
}) => {
  const baseOptions = options.map((option) => ({
    ...option,
    value: 0,
  }));
  const [starOptions, setStarOptions] = useState(baseOptions);
  const [description, setDescription] = useState("");
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
      await onSubmit({ values, description });
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
          <ContractDetailsLight
            fee={order.tenantFee}
            fromDate={order.offerStartDate}
            toDate={order.offerEndDate}
            price={order.offerPricePerDay}
          />

          <ItemInfo
            setCurrentOpenImg={setCurrentOpenImg}
            listing={{
              name: order.listingName,
              listingImages: order.listingImages,
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
                  <MainReviewPart
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

export default ListingReviewForm;
