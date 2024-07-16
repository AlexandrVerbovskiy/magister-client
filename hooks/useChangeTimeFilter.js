import React, { useState, useEffect } from "react";
import {
  dateConverter,
} from "../utils";

const useWatchChangeTimeFilter = ({
  toTime,
  setToTime,
  fromTime,
  setFromTime,
  options,
  rebuild,
  defaultFromTime = null,
  defaultToTime = null,
}) => {
  const getTimeToProp = (date) => (date ? dateConverter(date) : null);

  useEffect(() => {
    if (
      getTimeToProp(fromTime) == options.fromTime &&
      getTimeToProp(toTime) == options.toTime
    )
      return;

    if (options.fromTime || defaultFromTime) {
      setFromTime(new Date(options.fromTime ?? defaultFromTime));
    }

    if (options.toTime || defaultToTime) {
      setToTime(new Date(options.toTime ?? defaultToTime));
    }
  }, [options.toTime, options.fromTime]);

  const handleChangeTimeFilter = (dates, needRebuild = false) => {
    let [from, to] = dates;
    const fromDate = from ? new Date(from) : null;
    let toDate = to ? new Date(to) : null;

    if (fromDate > toDate) {
      toDate = new Date(fromDate);
    }

    const propFromDate = getTimeToProp(fromDate);
    const propToDate = getTimeToProp(toDate);

    if ((from && to) || needRebuild) {
      setFromTime(fromDate);
      setToTime(toDate);

      rebuild({
        fromTime: propFromDate,
        toTime: propToDate,
      });
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
