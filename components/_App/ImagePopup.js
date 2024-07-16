import { useRef } from "react";
import STATIC from "../../static";
import { isClickedOnVisualImagePart } from "../../utils";

const ImagePopup = ({ open, close, photoUrl }) => {
  const supportImageRef = useRef(null);

  if (!open) return;

  const handleImageClick = (e) => {
    if (!isClickedOnVisualImagePart(e, supportImageRef.current)) {
      close();
    }
  };

  return (
    <div className="view-picture-parent bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="modal fade show"
        style={{ display: "block" }}
        tabIndex="-1"
        onClick={close}
      >
        <div
          className="modal-dialog modal-dialog-centered modal-xl"
          style={{ height: "90%", width: "90%", overflow: "hidden" }}
        >
          <div
            className="modal-content w-100 h-100"
            style={{ background: "transparent", border: "0" }}
          >
            <div className="modal-body w-100 h-100">
              <img
                onClick={handleImageClick}
                src={photoUrl ?? STATIC.DEFAULTS.PROFILE_PHOTO_LINK}
                alt="image"
                className="img-fluid w-100 h-100"
                style={{
                  objectFit: "contain",
                }}
              />
              <img
                ref={supportImageRef}
                className="d-none"
                src={photoUrl ?? STATIC.DEFAULTS.PROFILE_PHOTO_LINK}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePopup;
