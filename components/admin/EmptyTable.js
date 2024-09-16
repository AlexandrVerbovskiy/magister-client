const EmptyTable = ({ name = "entities" }) => {
  return (
    <div
      className="absolute flex justify-center items-center loading-pagination w-full"
      style={{ top: "50%", transform: "translateY(50%)" }}
    >
      <div className="">No {name} found</div>
    </div>
  );
};

export default EmptyTable;
