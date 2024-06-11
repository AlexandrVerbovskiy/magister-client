import React, { useContext, useEffect, useRef, useState } from "react";
import OwnerInfo from "../Order/OrderApprovementParts/OwnerInfo";
import ItemInfo from "../Order/OrderApprovementParts/ItemInfo";
import ErrorSpan from "../ErrorSpan";
import DashboardNavbar from "../Dashboard/DashboardNavbar";
import NavbarThree from "../_App/NavbarThree";

const options = [
  { title: "Damage", value: "damage" },
  { title: "Communication", value: "communication" },
  { title: "Problems with withdrawal", value: "problems-with-withdrawal" },
  { title: "Payment", value: "payment" },
  { title: "Others", value: "others" },
];

const Wrap = ({ children, needWrapping }) => {
  if (!needWrapping) return children;

  return (
    <>
      <DashboardNavbar />

      <div className="main-content d-flex flex-column">
        <NavbarThree />

        <div className="header-section">
          <div className="breadcrumb-area">
            <h1>Dispute</h1>
          </div>
        </div>

        {children}
      </div>
    </>
  );
};

const CreateDisputeSection = ({
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
  opponentName,
  opponentPhoto,
  setCurrentOpenImg,
  opponentCountItems,
  opponentCommentCountName,
  opponentAverageRatingName,
  opponentItemsType = "for rental",
  needWrapping = true,
}) => {
  const handleDescriptionChange = (e) => {
    setError(null);
    setDescription(e.target.value);
  };

  const handleChangeType = (value) => {
    setError(null);
    setType(value);
  };

  return (
    <Wrap needWrapping={needWrapping}>
      <div className="row">
        <div className="col-lg-4 col-md-12">
          <div className="listings-sidebar mt-0">
            <OwnerInfo
              data={{
                userName: opponentName,
                userPhoto: opponentPhoto,
                userCountItems: +opponentCountItems,
                userCommentCount: opponentCommentCountName,
                userAverageRating: opponentAverageRatingName,
              }}
              countItemsType={opponentItemsType}
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
                                  onChange={() =>
                                    handleChangeType(option.value)
                                  }
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
                    style={{ justifyContent: "space-between" }}
                  >
                    <button
                      onClick={onGoBack}
                      disabled={disabled}
                      type="button"
                    >
                      Go Back
                    </button>

                    <button
                      onClick={onSubmit}
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
    </Wrap>
  );
};

export default CreateDisputeSection;
