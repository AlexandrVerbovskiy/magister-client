import { useRef } from "react";
import STATIC from "../../../static";
import { isClickedOnVisualImagePart } from "../../../utils";

const ImageView = ({ open, imgSrc, close }) => {
  const supportImageRef = useRef(null);
  if (!open) return;

  const handleImageClick = (e) => {
    if (!isClickedOnVisualImagePart(e, supportImageRef.current)) {
      close();
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div
        className="absolute w-full h-full bg-gray-900 opacity-50"
        onClick={close}
      ></div>
      <div
        style={{ height: "90%", width: "90%", overflow: "hidden" }}
        className="modal-container mx-auto rounded z-50 overflow-y-auto"
      >
        <div className="w-full h-full modal-content text-left">
          <div className="w-full h-full flex justify-center">
            <img
              onClick={handleImageClick}
              src={imgSrc ?? STATIC.DEFAULTS.PHOTO_LINK}
              alt="image"
              className="relative w-full h-full"
              style={{
                objectFit: "contain",
              }}
            />
            <img
              ref={supportImageRef}
              className="hidden"
              src={imgSrc ?? STATIC.DEFAULTS.PHOTO_LINK}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageView;
