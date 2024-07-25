import { useLoading } from "../../hooks";

const PaginationLoading = () => {
  const dots = useLoading();

  return (
    <div className="loading-pagination">
      <div className="loading-pagination-img"></div>
      <div className="loading-pagination-text">Loading{dots}</div>
    </div>
  );
};

export default PaginationLoading;
