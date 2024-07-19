import PaginationLoading from "./PaginationLoading";

const PaginationLoadingWrapper = ({ children, active }) => {
  if (active) {
    return <PaginationLoading />;
  }

  return children;
};

export default PaginationLoadingWrapper;
