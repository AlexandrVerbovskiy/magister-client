import { useEffect, useState } from "react";
import { useLoading } from "../../hooks";

const PaginationLoading = () => {
  const dots = useLoading();

  return (
    <section className="listing-area">
      <div className="loading-pagination">
        <div className="loading-pagination-img"></div>
        <div className="loading-pagination-text">Loading{dots}</div>
      </div>
    </section>
  );
};

export default PaginationLoading;
