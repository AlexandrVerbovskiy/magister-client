import STATIC from "../../static";

const ImagePopup = ({ open, close, photoUrl }) => {
  if (!open) return;

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
          style={{ maxWidth: "42rem" }}
        >
          <div className="modal-content">
            <div className="modal-body">
              <img
                src={photoUrl ?? STATIC.defaultPhotoLink}
                alt="image"
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePopup;
