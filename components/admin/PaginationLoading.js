import { useLoading } from "../../hooks";

const PaginationLoading = () => {
  const dots = useLoading();

  return (
    <div
      className="absolute flex justify-center items-center loading-pagination w-full"
      style={{ top: "50%", transform: "translateY(50%)" }}
    >
      <div className="">Loading{dots}</div>
    </div>
  );
};

export default PaginationLoading;
