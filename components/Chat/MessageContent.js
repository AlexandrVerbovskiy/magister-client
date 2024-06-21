import ENV from "../../env";

const MessageContent = ({ isTemp, type, content }) => {
  if (type == "text") {
    return <p dangerouslySetInnerHTML={{ __html: content.text }}></p>;
  }

  let src = "";

  if (
    type === "image" ||
    type === "video" ||
    type === "audio" ||
    type === "file"
  ) {
    if (isTemp) {
      const blob = new Blob([content.path], { type: content.path["type"] });
      src = URL.createObjectURL(blob);
    } else {
      src = ENV.SERVER_URL + "/" + content.path;
    }
  }

  if (type === "image") {
    return <img height="200px" className="" src={src} />;
  }

  if (type === "video") {
    return <video height="200px" controls className="" src={src} />;
  }

  if (type === "audio") {
    return <audio controls className="" src={src} />;
  }

  if (type === "file") {
    return (
      <a style={{ color: "inherit" }} className="d-flex" href={src} download>
        <div className="me-1">
          <i className="bx bxs-file"></i>
        </div>
        {content.filename}
      </a>
    );
  }

  return <p>Unpredictable message</p>;
};

export default MessageContent;
