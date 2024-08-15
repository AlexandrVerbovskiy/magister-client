import { useRef } from "react";

const BaseModal = ({
  active,
  closeModal,
  children,
  className = "",
  needCloseBtn = true,
  style = {},
  hidden = false,
  size = "normal",
}) => {
  if (className) {
    className += " ";
  }

  className += "modal loginRegisterModal base-modal";

  if(size=="big"){
    className += " modal-xxl";
  }

  if (active && !hidden) {
    className += " show";
  }

  const handlePopupOverlayClick = (e) => {
    if (
      e.target.classList.contains("modal-dialog") ||
      e.target.closest(".modal-dialog")
    )
      return;

    closeModal();
  };

  return (
    <>
      <div
        className={
          active && !hidden ? "body_overlay open test" : "body_overlay"
        }
      ></div>
      <div
        style={style}
        className={className}
        onMouseDown={handlePopupOverlayClick}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {needCloseBtn && (
              <button type="button" className="close" onClick={closeModal}>
                <i className="bx bx-x"></i>
              </button>
            )}

            <div className="tab-content mt-0">
              <div className="tab-pane fade show active">
                <div className="miran-login left-scrollable">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BaseModal;
