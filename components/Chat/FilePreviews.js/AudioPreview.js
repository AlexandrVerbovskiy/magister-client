export default ({ file, type }) => {
  return (
    <audio controls className="w-100">
      <source src={file.src} type={"audio/" + type} />
      Your browser does not support the video tag.
    </audio>
  );
};
