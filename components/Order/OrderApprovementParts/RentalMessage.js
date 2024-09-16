import ErrorSpan from "../../ErrorSpan";

const RentalMessage = ({
  handleGoBack,
  setSendingMessage,
  sendingMessage,
  sendingMessageError,
  setSendingMessageError,
  onSendClick,
}) => {
  return (
      <div id="rental-message">
        <div className="review-form-wrapper">
          <h3>Message the owner</h3>
          <p className="comment-notes">
            We recommend checking availability of multiple options / owner to
            maximise the change of finding an item that suits your dates and
            pickup.
          </p>
          <form onSubmit={onSendClick}>
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <div className={`${sendingMessageError ? "is-invalid" : ""}`}>
                    <textarea
                      placeholder="Send any other details about your request including pickup times."
                      className="form-control"
                      cols="30"
                      rows="6"
                      value={sendingMessage}
                      onInput={(e) => {
                        setSendingMessageError(null);
                        setSendingMessage(e.target.value);
                      }}
                    ></textarea>
                    <ErrorSpan
                      className="text-end"
                      error={sendingMessageError}
                    />
                  </div>
                </div>
              </div>

              <div className="col-lg-12 col-md-12">
                <div
                  className="d-flex flex-row justify-content-end"
                  style={{ marginTop: 0, marginBottom: "18px" }}
                >
                  <button
                    type="button"
                    className="me-4"
                    style={{ marginTop: 0 }}
                    onClick={handleGoBack}
                  >
                    Back
                  </button>

                  <button type="submit" style={{ marginTop: 0 }}>
                    Submit
                  </button>
                </div>

                <p className="comment-notes text-end">
                  Sending a request is not biding.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
  );
};

export default RentalMessage;
