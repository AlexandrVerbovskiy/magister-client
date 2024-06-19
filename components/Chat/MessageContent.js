import STATIC from "../../static";
import ENV from "../../env";

const MessageContent = ({ type, content }) => {
  if (type == "text") {
    return <p dangerouslySetInnerHTML={{ __html: content.text }}></p>;
  }

  const fullFilePath = ENV.SERVER_URL + "/" + STATIC.SERVER_MESSAGE_FILES_PATH;

  if (type === "image") {
    return <img className="" src={fullFilePath + "/" + content.path} />;
  }

  if (type === "video") {
    return (
      <video controls className="" src={fullFilePath + "/" + content.path} />
    );
  }

  if (type === "audio") {
    return (
      <audio controls className="" src={fullFilePath + "/" + content.path} />
    );
  }

  if (type === "file") {
    return (
      <a className="" href={fullFilePath + "/" + content.path} download>
        <div className="">
          <i className="bx bxs-file"></i>
        </div>
        {content}
      </a>
    );
  }

  return <p>WHAT?!?!??!</p>;
};

export default MessageContent;
