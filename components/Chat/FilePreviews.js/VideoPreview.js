export default ({ file, type }) => {
  return (
    <video style={{ objectFit: "contain" }} className="w-100" controls>
      <source src={file.src} type={"video/" + type} />
      Your browser does not support the video tag.
    </video>
  );
};
