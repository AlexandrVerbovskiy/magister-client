import VideoPreview from "./VideoPreview";
import AudioPreview from "./AudioPreview";
import FilePreview from "./FilePreview";
import ImagePreview from "./ImagePreview";
import { checkIsFileHasExtension } from "../../../utils";
import STATIC from "../../../static";

export default ({ file }) => {
  let FileElem = FilePreview;

  if (checkIsFileHasExtension(file, STATIC.IMAGE_EXTENSIONS)) {
    FileElem = ImagePreview;
  }

  const videoType = checkIsFileHasExtension(file, STATIC.VIDEO_EXTENSIONS);

  if (videoType) {
    FileElem = ({ file }) => <VideoPreview file={file} type={videoType} />;
  }

  const audioType = checkIsFileHasExtension(file, STATIC.AUDIO_EXTENSIONS);

  if (audioType) {
    FileElem = ({ file }) => <AudioPreview file={file} type={audioType} />;
  }

  return (
    <div className="card" style={{ maxWidth: "100%", maxHeight: "400px" }}>
      <div className="card-body d-flex justify-content-center">
        <FileElem file={file} />
      </div>
    </div>
  );
};
