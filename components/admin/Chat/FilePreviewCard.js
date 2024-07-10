import { checkIsFileHasExtension } from "../../../utils";
import STATIC from "../../../static";

export default ({ file }) => {
  let FileElem = () => <div className="w-full">Name: {file.name}</div>;

  if (checkIsFileHasExtension(file, STATIC.IMAGE_EXTENSIONS)) {
    FileElem = () => (
      <img
        src={file.src}
        className="full block"
        alt="..."
        style={{ objectFit: "contain", maxHeight: "400px", maxWidth: "100%" }}
      />
    );
  }

  const videoType = checkIsFileHasExtension(file, STATIC.VIDEO_EXTENSIONS);

  if (videoType) {
    FileElem = () => (
      <video
        className="full object-contain"
        style={{ maxHeight: "400px", maxWidth: "100%" }}
        controls
      >
        <source src={file.src} type={"video/" + videoType} />
        Your browser does not support the video tag.
      </video>
    );
  }

  const audioType = checkIsFileHasExtension(file, STATIC.AUDIO_EXTENSIONS);

  if (audioType) {
    FileElem = () => (
      <audio controls className="w-full">
        <source src={file.src} type={"audio/" + audioType} />
        Your browser does not support the video tag.
      </audio>
    );
  }

  return (
    <div style={{ maxWidth: "100%", maxHeight: "400px" }}>
      <div className="text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 p-3 rounded-lg rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-md mb-1 flex items-center justify-center">
        <FileElem />
      </div>
    </div>
  );
};
