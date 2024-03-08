import React, { useState, useEffect } from "react";
import { timeConverter } from "../utils";

const useWatchChangeTimeFilter = ({
  toTime,
  setToTime,
  fromTime,
  setFromTime,
  options,
  rebuild,
}) => {
  const getTimeToProp = (date) => (date ? timeConverter(date) : null);

  useEffect(() => {
    if (
      getTimeToProp(fromTime) == options.fromTime &&
      getTimeToProp(toTime) == options.toTime
    )
      return;

    setFromTime(new Date(options.fromTime));
    setToTime(new Date(options.toTime));
  }, [options.toTime, options.fromTime]);

  const handleChangeTimeFilter = (dates) => {
    let [from, to] = dates;
    const fromDate = from ? new Date(from) : null;
    let toDate = to ? new Date(to) : null;

    if (fromDate > toDate) {
      toDate = new Date(fromDate);
    }

    if (from) {
      fromDate.setHours(0, 0, 0, 0);
    }

    if (to) {
      toDate.setHours(23, 59, 59, 999);
    }

    const propFromDate = getTimeToProp(fromDate);
    const propToDate = getTimeToProp(toDate);

    if (from && to) {
      setFromTime(fromDate);
      setToTime(toDate);

      rebuild(
        {
          fromTime: propFromDate,
          toTime: propToDate,
        },
        ["fromTime", "toTime"]
      );
    }
  };

  const handleChangeFromDate = (value) => {
    handleChangeTimeFilter([value, toTime]);
  };

  const handleChangeToDate = (value) => {
    handleChangeTimeFilter([fromTime, value]);
  };

  return { handleChangeTimeFilter, handleChangeFromDate, handleChangeToDate };
};

export default useWatchChangeTimeFilter;
