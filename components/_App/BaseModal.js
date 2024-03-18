const BaseModal = ({ active, toggleActive, children, className = "" }) => {
  if (className) className += " ";
  className += "modal loginRegisterModal base-modal";
  if (active) className += " show";
  return (
    <>
      <div className={active ? "body_overlay open" : "body_overlay"}></div>
      <div className={className}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <button type="button" className="close" onClick={toggleActive}>
              <i className="bx bx-x"></i>
            </button>

            <div className="tab-content mt-0">
              <div className="tab-pane fade show active">
                <div className="miran-login">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BaseModal;
