import React from "react";
import OwnerInfo from "../Order/OrderApprovementParts/OwnerInfo";
import ItemInfo from "../Order/OrderApprovementParts/ItemInfo";
import ErrorSpan from "../ErrorSpan";
import STATIC from "../../static";

const options = Object.keys(STATIC.DISPUTE_TYPE_TITLE).map((value) => ({
  title: STATIC.DISPUTE_TYPE_TITLE[value],
  value,
}));

const CreateDisputeSection = (data) => {
  const {
    type,
    error,
    setType,
    listing,
    setError,
    onGoBack,
    onSubmit,
    disabled,
    description,
    setDescription,
    opponentId,
    opponentName,
    opponentPhoto,
    setCurrentOpenImg,
    opponentCountItems,
    opponentCommentCount,
    opponentAverageRating,
    opponentItemsType = "for rental",
    isOwnerCreateDispute,
  } = data;

  const handleDescriptionChange = (e) => {
    setError(null);
    setDescription(e.target.value);
  };

  const handleChangeType = (value) => {
    setError(null);
    setType(value);
  };

  const handleSubmit = () => {
    if (!description || description.trim().length < 1) {
      setError("Required field");
      return;
    }

    onSubmit();
  };

  return (
    <div className="row">
      <div className="col-lg-4 col-md-12">
        <div className="listings-sidebar mt-0">
          <OwnerInfo
            data={{
              userId: opponentId,
              userName: opponentName,
              userPhoto: opponentPhoto,
              userCountItems: +opponentCountItems,
              userCommentCount: opponentCommentCount,
              userAverageRating: opponentAverageRating,
            }}
            countItemsType={opponentItemsType}
            title={isOwnerCreateDispute ? "Renter" : "Owner"}
          />

          <ItemInfo setCurrentOpenImg={setCurrentOpenImg} listing={listing} />
        </div>
      </div>
      <div className="col-lg-8 col-md-12">
        <div className="listings-details-desc mt-0">
          <div id="add-review">
            <div className="review-form-wrapper">
              <h3>Dispute details</h3>
              <p className="comment-notes">What is the dispute reason?</p>

              <form>
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <ul className="facilities-list">
                        {options.map((option) => (
                          <li key={option.value}>
                            <label className="radio">
                              <input
                                type="radio"
                                name="dispute-type"
                                value={option.value}
                                onChange={() => handleChangeType(option.value)}
                                checked={type == option.value}
                              />
                              <span>{option.title}</span>
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div
                      style={{
                        borderBottom: "1px solid #E8E8E8",
                        margin: "40px 0 20px",
                      }}
                    />

                    <div className="form-group">
                      <textarea
                        placeholder="Explain the reason of the dispute"
                        className="form-control"
                        cols="30"
                        rows="6"
                        value={description}
                        onInput={handleDescriptionChange}
                      ></textarea>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="w-full form-group mb-0">
                    <div className="is-invalid" style={{ marginTop: "-25px" }}>
                      <ErrorSpan error={error} />
                    </div>
                  </div>
                )}

                <div
                  className="col-lg-12 col-md-12 d-flex"
                  style={{ justifyContent: "space-between" }}
                >
                  <button onClick={onGoBack} disabled={disabled} type="button">
                    Go Back
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={disabled}
                    type="button"
                    className="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDisputeSection;
