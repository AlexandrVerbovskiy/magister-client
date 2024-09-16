import { checkIsFileHasExtension } from "../../utils";
import STATIC from "../../static";

export default ({ file }) => {
  let FileElem = () => <div className="w-100">Name: {file.name}</div>;

  if (checkIsFileHasExtension(file, STATIC.IMAGE_EXTENSIONS)) {
    FileElem = () => (
      <img
        src={file.src}
        className="d-block w-100"
        alt="..."
        style={{ objectFit: "contain" }}
      />
    );
  }

  const videoType = checkIsFileHasExtension(file, STATIC.VIDEO_EXTENSIONS);

  if (videoType) {
    FileElem = () => (
      <video style={{ objectFit: "contain" }} className="w-100" controls>
        <source src={file.src} type={"video/" + videoType} />
        Your browser does not support the video tag.
      </video>
    );
  }

  const audioType = checkIsFileHasExtension(file, STATIC.AUDIO_EXTENSIONS);

  if (audioType) {
    FileElem = () => (
      <audio controls className="w-100">
        <source src={file.src} type={"audio/" + audioType} />
        Your browser does not support the video tag.
      </audio>
    );
  }

  return (
    <div className="card" style={{ maxWidth: "100%", maxHeight: "400px" }}>
      <div className="card-body d-flex justify-content-center overflow-hidden">
        <FileElem />
      </div>
    </div>
  );
};
