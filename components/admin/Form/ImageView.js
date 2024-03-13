import STATIC from "../../../static";

const ImageView = ({ open, imgSrc, close }) => {
  if (!open) return;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div
        className="absolute w-full h-full bg-gray-900 opacity-50"
        onClick={close}
      ></div>
      <div className="modal-container bg-white w-11/12 md:max-w-2xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
        <div className="modal-content text-left">
          <div>
            <img
              src={imgSrc ?? STATIC.defaultPhotoLink}
              alt="image"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageView;
