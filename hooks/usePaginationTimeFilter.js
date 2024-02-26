import React, { useState, useEffect } from "react";
import { timeConverter } from "../utils";

const usePaginationTimeFilter = ({options, rebuild}) => {
  const [fromTime, setFromTime] = useState(null);
  const [toTime, setToTime] = useState(null);

  const getTimeToProp = (date) => (date ? timeConverter(date) : null);

  const handleChangeTimeFilter = (dates) => {
    let [from, to] = dates;
    const fromDate = new Date(from);
    const toDate = new Date(to);

    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(23, 59, 59, 999);

    if (from && to) {
      setFromTime(fromDate);
      setToTime(toDate);

      rebuild({
        fromTime: getTimeToProp(fromDate),
        toTime: getTimeToProp(toDate),
      });
    }
  };

  useEffect(() => {
    if (
      getTimeToProp(fromTime) == options.fromTime &&
      getTimeToProp(toTime) == options.toTime
    )
      return;

    setFromTime(new Date(options.fromTime));
    setToTime(new Date(options.toTime));
  }, [options.toTime, options.fromTime]);

  return {
    fromTime,
    toTime,
    handleChangeTimeFilter,
    getTimeFilterProps: () => ({
      fromTime: getTimeToProp(fromTime),
      toTime: getTimeToProp(toTime),
    }),
  };
};

export default usePaginationTimeFilter;
