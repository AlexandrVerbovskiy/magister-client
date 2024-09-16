import { useState } from "react";
import ImageView from "../Form/ImageView";

const ListingPhotoView = ({ src }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <div
        className="xl:w-1/4 lg:w-1/3 md:w-1/2 gallery-flex-parent listing-gallery-flex-parent"
        onClick={openPopup}
      >
        <div
          style={{ height: "200px !important", width: "100%" }}
          className="bg-gray-100 border relative rounded-lg overflow-hidden shadow-md xl:w-1/4 lg:w-1/3 md:w-1/2 gallery-flex-parent"
        >
          <div
            style={{ height: "100%", width: "100%" }}
            className="flex flex-col form-group cursor-zoom-in"
          >
            <img src={src} />
          </div>
        </div>
      </div>
      <ImageView open={isPopupOpen} imgSrc={src} close={closePopup} />
    </>
  );
};

export default ListingPhotoView;
