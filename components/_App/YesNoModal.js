const YesNoModal = ({
  active,
  closeModal,
  title,
  body = null,
  onAccept,
  acceptText = "Save",
  actionsParentClass = "mt-4",
  closeModalText = "Cancel",
  closeModalClassName = "button-danger",
  acceptModalClassName = "",
  bodyType = "text",
}) => {
  const handleAccept = () => {
    onAccept();
    closeModal();
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
            <button type="button" className="close" onClick={closeModal}>
              <i className="bx bx-x"></i>
            </button>

            <div className="tab-content mt-0">
              <div className="tab-pane fade show active" id="login">
                <div className="miran-login">
                  <div className="w-100 sub-title mb-2">
                    <div className="w-100 row-dots-end">{title}</div>
                  </div>
                  {bodyType == "html" ? (
                    <div
                      className="w-100 row-dots-end"
                      dangerouslySetInnerHTML={{ __html: body }}
                    ></div>
                  ) : (
                    <div className="w-100 row-dots-end">{body}</div>
                  )}

                  <form
                    method="get"
                    className={`${actionsParentClass} d-flex gap-2`}
                  >
                    <button
                      type="button"
                      className={closeModalClassName}
                      onClick={closeModal}
                    >
                      {closeModalText}
                    </button>
                    <button
                      type="button"
                      onClick={handleAccept}
                      className={acceptModalClassName}
                    >
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
