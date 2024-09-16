import STATIC from "../../../static";
import { byteConverter } from "../../../utils";

const VisualizeCamera = ({ videoRef, image }) => {
  return (
    <div className="circle-section">
      {image && <img src={image} />}
      <video
        style={image ? { display: "none" } : { transform: "scaleX(-1)" }}
        ref={videoRef}
        autoPlay
      />
    </div>
  );
};

const UserPhotoSection = ({
  goNext,
  error,
  setError,
  videoRef,
  disabled,
  setDisabled,
  stopStream,
  startStream,
  active,
  image,
  setImage,
}) => {
  const handleCapturePhoto = () => {
    if (disabled) {
      return;
    }

    setDisabled(true);
    setError(null);

    const video = videoRef.current;
    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    context.translate(canvas.width, 0);
    context.scale(-1, 1);

    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    const imageSrc = canvas.toDataURL("image/jpeg");
    canvas.remove();

    const fileSizeLimit = Number(STATIC.LIMITS.FILE_SIZE);
    setDisabled(false);

    if (imageSrc.length > fileSizeLimit) {
      setError("File can't be larger than " + byteConverter(fileSizeLimit));
      return;
    }

    setImage(imageSrc);
    stopStream();
  };

  const handleRemakePhoto = async () => {
    setImage(null);
    await startStream();
  };

  return (
    <div className={`setUserPhoto${active ? "" : " d-none"}`}>
      <div className="row justify-content-center">
        <div className="col col-12 col-lg-9">
          <div className="row">
            <div className="col-12 col-lg-4 d-flex justify-content-center">
              <VisualizeCamera videoRef={videoRef} image={image} />
            </div>
            {active && (
              <div className="col-12 col-lg-8 d-flex justify-content-center justify-content-lg-end">
                <div className="h-100 d-flex justify-content-center flex-column">
                  <div className="user-photo-right-section">
                    <div className="sub-title">
                      Position your face in the circle and tap on continue
                    </div>
                    <div className="d-flex flex-column align-items-center align-items-lg-start">
                      {image && (
                        <button
                          type="button"
                          className="d-flex align-items-center justify-content-center"
                          onClick={handleRemakePhoto}
                        >
                          Take Another Photo
                          <i className="ms-2 bx bx-camera"> </i>
                        </button>
                      )}

                      {!image && (
                        <button
                          type="button"
                          className="d-flex align-items-center justify-content-center"
                          onClick={handleCapturePhoto}
                        >
                          Make Photo
                          <i className="ms-2 bx bx-camera"> </i>
                        </button>
                      )}

                      {image && (
                        <button
                          type="button"
                          className="d-flex align-items-center justify-content-center mt-2"
                          onClick={goNext}
                        >
                          Continue{" "}
                          <i className="ms-2 flaticon-right-arrow"> </i>
                        </button>
                      )}
                    </div>

                    {error && <div className="error-block">{error}</div>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPhotoSection;
