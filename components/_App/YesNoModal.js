const YesNoModal = ({
  active,
  toggleActive,
  title,
  body = null,
  onAccept,
  acceptText = "Save",
  actionsParentClass = "mt-4",
  closeModalText = "Cancel",
}) => {
  const handleAccept = () => {
    toggleActive();
    onAccept();
  };
  return (
    <>
      <div className={active ? "body_overlay open" : "body_overlay"}></div>
      <div
        className={
          active
            ? "modal loginRegisterModal yes-no-modal show"
            : "modal loginRegisterModal yes-no-modal"
        }
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <button type="button" className="close" onClick={toggleActive}>
              <i className="bx bx-x"></i>
            </button>

            <div className="tab-content mt-0">
              <div className="tab-pane fade show active" id="login">
                <div className="miran-login">
                  <span className="sub-title mb-2">
                    <span>{title}</span>
                  </span>

                  <span>{body}</span>

                  <form
                    method="get"
                    className={`${actionsParentClass} d-flex gap-2`}
                  >
                    <button
                      type="button"
                      className="button-danger"
                      onClick={toggleActive}
                    >
                      {closeModalText}
                    </button>
                    <button type="button" onClick={handleAccept}>
                      {acceptText}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default YesNoModal;
