import BaseModal from "../_App/BaseModal";

const SuccessIcon = ({
  modalActive,
  closeModal,
  text = null,
  textWeight = null,
  mainCloseButtonText = "Close",
}) => {
  return (
    <BaseModal
      active={modalActive}
      closeModal={closeModal}
      needCloseBtn={false}
      className="modal-padding-bottom-20"
    >
      <div className="icon-popup-body">
        <svg
          width="142"
          height="141"
          viewBox="0 0 142 141"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M60.6779 95.8431L35.7502 70.9096L44.0575 62.6023L60.6779 79.2168L93.9069 45.9819L102.22 54.2951L60.6779 95.8431Z"
            fill="#594FBF"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.37524 70.4985C6.37524 34.8079 35.3096 5.87354 71.0002 5.87354C106.691 5.87354 135.625 34.8079 135.625 70.4985C135.625 106.189 106.691 135.124 71.0002 135.124C35.3096 135.124 6.37524 106.189 6.37524 70.4985ZM71.0002 123.374C64.0566 123.374 57.1809 122.006 50.7659 119.349C44.3508 116.691 38.5219 112.797 33.612 107.887C28.7021 102.977 24.8073 97.148 22.1501 90.7329C19.4929 84.3178 18.1252 77.4422 18.1252 70.4985C18.1252 63.5549 19.4929 56.6792 22.1501 50.2641C24.8073 43.8491 28.7021 38.0202 33.612 33.1103C38.5219 28.2004 44.3508 24.3056 50.7659 21.6484C57.1809 18.9912 64.0566 17.6235 71.0002 17.6235C85.0236 17.6235 98.4725 23.1943 108.389 33.1103C118.304 43.0262 123.875 56.4752 123.875 70.4985C123.875 84.5219 118.304 97.9708 108.389 107.887C98.4725 117.803 85.0236 123.374 71.0002 123.374Z"
            fill="#594FBF"
          />
        </svg>

        {text && (
          <div
            className="icon-popup-body-text"
            style={{ fontWeight: textWeight ?? 400 }}
          >
            {text}
          </div>
        )}

        {mainCloseButtonText && (
          <button
            className="icon-popup-body-button"
            type="button"
            onClick={closeModal}
          >
            {mainCloseButtonText}
          </button>
        )}
      </div>
    </BaseModal>
  );
};

export default SuccessIcon;
