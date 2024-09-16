import React, { useState } from "react";
import {
  dateConverter,
} from "../utils";
import { useRouter } from "next/router";

const useInitPaginationTimeFilter = ({
  defaultFromTime = null,
  defaultToTime = null,
} = {}) => {
  const router = useRouter();

  let baseFromTime = router.query["from-time"] ?? defaultFromTime;
  let baseToTime = router.query["to-time"] ?? defaultToTime;

  if (baseFromTime) {
    baseFromTime = new Date(baseFromTime);
  }

  if (baseToTime) {
    baseToTime = new Date(baseToTime);
  }

  const [fromTime, setFromTime] = useState(baseFromTime);
  const [toTime, setToTime] = useState(baseToTime);

  const getTimeToProp = (date) => (date ? dateConverter(date) : null);

  const fromTimePropHidden = (newValue) => {
    if (defaultFromTime) {
      return getTimeToProp(newValue) == getTimeToProp(defaultFromTime);
    }

    return false;
  };

  const toTimePropHidden = (newValue) => {
    if (defaultToTime) {
      return getTimeToProp(newValue) == getTimeToProp(defaultToTime);
    }

    return false;
  };

  const fromTimeProp = {
    value: getTimeToProp(fromTime),
    name: "from-time",
    hidden: fromTimePropHidden,
  };

  const toTimeProp = {
    value: getTimeToProp(toTime),
    name: "to-time",
    hidden: toTimePropHidden,
  };

  return {
    fromTime,
    setFromTime,
    toTime,
    setToTime,
    getTimeFilterProps: () => ({
      fromTime: fromTimeProp,
      toTime: toTimeProp,
    }),
  };
};

export default useInitPaginationTimeFilter;
