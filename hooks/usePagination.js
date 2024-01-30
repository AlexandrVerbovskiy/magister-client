import { useState, useEffect, useRef } from "react";

const usePagination = () => {
  const countPages = useRef(0);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [canMoveNextPage, setCanMoveNextPage] = useState(true);
  const [canMovePrevPage, setCanMovePrevPage] = useState(true);

  const [orderField, setOrderField] = useState(null);
  const [orderType, setOrderType] = useState(null);
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    setCanMovePrevPage(page != 1);
    setCanMoveNextPage(page >= countPages.current);
  }, [page]);

  const handleChangeOrder = (orderName) => {
    if (order && order.field == orderName) {
      if (order.type == "desc") {
        setOrderField(orderName);
        setOrderType("asc");
      } else {
        setOrderField(null);
        setOrderType(null);
      }
    } else {
      setOrderField(orderName);
      setOrderType("desc");
    }
  };

  const moveToPage = (number) => {
    if (number > countPages.current) return;
    setPage(number);
  };

  return {
    moveToPage,
    filterValue,
    setFilterValue,
    orderField,
    orderType,
    handleChangeOrder,
    canMoveNextPage,
    canMovePrevPage,
    items,
    page: page,
    countPages: countPages.current,
  };
};

export default usePagination;
