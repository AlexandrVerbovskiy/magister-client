import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

const usePagination = ({
  getItemsFunc,
  onError = null,
  getDopProps = null,
  defaultData = null,
}) => {
  const router = useRouter();
  const isFirstRef = useRef(true);

  const countPagesRef = useRef(0);
  const countItemsRef = useRef(0);

  const [options, setOptions] = useState({});
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState(null);
  const [orderType, setOrderType] = useState(null);
  const [filter, setFilter] = useState("");

  const [items, setItems] = useState([]);
  const [canMoveNextPage, setCanMoveNextPage] = useState(true);
  const [canMovePrevPage, setCanMovePrevPage] = useState(true);

  const [currentFrom, setCurrentFrom] = useState(0);
  const [currentTo, setCurrentTo] = useState(0);

  const updateStateByOption = (gotOptions, unusualKeys = []) => {
    setOptions(gotOptions);
    setPage(gotOptions.page);
    setItemsPerPage(gotOptions.count);
    setOrder(gotOptions.order);
    setOrderType(gotOptions.orderType);
    setFilter(gotOptions.filter);

    const queryParams = {};

    if (getDopProps) {
      const dopProps = getDopProps();

      Object.keys(dopProps).forEach((key) => {
        if (dopProps[key]) {
          queryParams[key] = dopProps[key];
        }
      });
    }

    if (gotOptions.page > 1) {
      queryParams["page"] = gotOptions.page;
    }

    if (gotOptions.order) {
      queryParams["order"] = gotOptions.order;
      if (gotOptions.orderType) {
        queryParams["orderType"] = gotOptions.orderType;
      }
    }

    if (gotOptions.filter) {
      queryParams["filter"] = gotOptions.filter;
    }

    unusualKeys.forEach((key) => {
      if (gotOptions[key]) {
        queryParams[key] = gotOptions[key];
      }
    });

    const props = Object.keys(queryParams)
      .map((param) => `${param}=${queryParams[param]}`)
      .join("&");

    const currentLink = window.location.href;

    const newLinkPart =
      window.location.origin +
      window.location.pathname +
      (props ? `?${props}` : "");

    if (currentLink !== newLinkPart) {
      window.history.replaceState(null, null, newLinkPart);
    }
  };

  const onChangeOptions = async (dopBody = {}, unusualKeys = []) => {
    try {
      let props = {
        clientTime: Date.now(),
        order,
        orderType,
        itemsPerPage,
        filter,
      };

      if (getDopProps) {
        props = { ...props, ...getDopProps() };
      }

      props = { ...props, ...dopBody };

      const res = await getItemsFunc(props);

      const {
        options: gotOptions,
        items: gotItems,
        countItems: gotCountItems,
      } = res;

      countPagesRef.current = gotOptions.totalPages;
      countItemsRef.current = gotCountItems;
      updateStateByOption(gotOptions, unusualKeys);
      setItems(gotItems);
    } catch (e) {
      onError(e);
    }
  };

  useEffect(() => {
    const dopBody = {};
    const { order, orderType, page, filter } = router.query;

    if (order) {
      dopBody["order"] = order;
    }

    if (orderType) {
      dopBody["orderType"] = orderType;
    }

    if (page) {
      dopBody["page"] = page;
    }

    if (filter) {
      dopBody["filter"] = filter;
    }

    if (isFirstRef.current) {
      isFirstRef.current = false;

      if (defaultData) {
        const {
          options: gotOptions,
          items: gotItems,
          countItems: gotCountItems,
        } = defaultData;

        countPagesRef.current = gotOptions.totalPages;
        countItemsRef.current = gotCountItems;
        updateStateByOption(gotOptions);
        setItems(gotItems);
      } else {
        onChangeOptions(dopBody);
      }
    } else {
      onChangeOptions(dopBody);
    }
  }, []);

  useEffect(() => {
    setCanMovePrevPage(page > 1);
    setCanMoveNextPage(page < countPagesRef.current);

    const from = Math.min((page - 1) * itemsPerPage + 1, countItemsRef.current);
    const to = Math.min(page * itemsPerPage, countItemsRef.current);

    setCurrentFrom(from);
    setCurrentTo(to);
  }, [page, countItemsRef.current, countPagesRef.current]);

  const handleChangeOrder = (selectedOrderName) => {
    let newOrder = null;
    let newType = null;

    if (order && order == selectedOrderName) {
      if (orderType == "desc") {
        newOrder = selectedOrderName;
        newType = "asc";
      }
    } else {
      newOrder = selectedOrderName;
      newType = "desc";
    }

    setOrder(newOrder);
    setOrderType(newType);

    onChangeOptions({ order: newOrder, orderType: newType });
  };

  const moveToPage = (number) => {
    if (number > countPagesRef.current) return;
    setPage(number);
    onChangeOptions({ page: number });
  };

  const changeFilter = (value) => {
    setFilter(value);
    setPage(1);
    onChangeOptions({ page: 1, filter: value });
  };

  const setItemFields = (itemInfo, itemId) => {
    setItems((prev) => {
      const res = [];

      prev.forEach((item) => {
        if (item.id === itemId) {
          res.push({ ...item, ...itemInfo });
        } else {
          res.push(item);
        }
      });

      return res;
    });
  };

  return {
    moveToPage,
    changeFilter,
    filter,
    order,
    orderType,
    handleChangeOrder,
    canMoveNextPage,
    canMovePrevPage,
    items,
    currentTo,
    currentFrom,
    page,
    countPages: countPagesRef.current,
    countItems: countItemsRef.current,
    rebuild: onChangeOptions,
    setItemFields,
    options,
  };
};

export default usePagination;
