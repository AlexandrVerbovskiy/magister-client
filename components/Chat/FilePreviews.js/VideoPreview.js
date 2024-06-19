export default ({ file, type }) => {
  return (
    <video className="w-100" controls>
      <source src={file.src} type={"video/" + type} />
      Your browser does not support the video tag.
    </video>
  );
};
