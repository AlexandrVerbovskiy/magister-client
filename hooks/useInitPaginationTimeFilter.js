import React, { useState } from "react";
import {
  getDateByCurrentAdd,
  getDateByCurrentReject,
  timeNormalConverter,
} from "../utils";
import { useRouter } from "next/router";

const useInitPaginationTimeFilter = ({
  defaultFromTime = null,
  defaultToTime = null,
} = {}) => {
  const router = useRouter();

  if (!defaultToTime) {
    defaultToTime = getDateByCurrentAdd(1);
  }

  if (!defaultFromTime) {
    defaultFromTime = getDateByCurrentReject(1);
  }

  let baseFromTime = router.query.fromTime ?? defaultFromTime;
  let baseToTime = router.query.toTime ?? defaultToTime;

  if (baseFromTime) {
    baseFromTime = new Date(baseFromTime);
  }

  if (baseToTime) {
    baseToTime = new Date(baseToTime);
  }

  const [fromTime, setFromTime] = useState(baseFromTime);
  const [toTime, setToTime] = useState(baseToTime);

  const getTimeToProp = (date) => (date ? timeNormalConverter(date) : null);

  return {
    fromTime,
    setFromTime,
    toTime,
    setToTime,
    getTimeFilterProps: () => ({
      fromTime: getTimeToProp(fromTime),
      toTime: getTimeToProp(toTime),
    }),
  };
};

export default useInitPaginationTimeFilter;
