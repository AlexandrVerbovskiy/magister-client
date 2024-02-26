import React, { useState, useEffect } from "react";
import { timeConverter } from "../utils";
import { useRouter } from "next/router";

const useInitPaginationTimeFilter = () => {
  const router = useRouter();
  let baseFromTime = router.query.fromTime;
  let baseToTime = router.query.toTime;

  if (baseFromTime) {
    baseFromTime = new Date(baseFromTime);
  }

  if (baseToTime) {
    baseToTime = new Date(baseToTime);
  }

  const [fromTime, setFromTime] = useState(baseFromTime);
  const [toTime, setToTime] = useState(baseToTime);

  const getTimeToProp = (date) => (date ? timeConverter(date) : null);

  return {
    fromTime,
    setFromTime,
    toTime,
    setToTime,
    getTimeFilterProps:()=> ({
      fromTime: getTimeToProp(fromTime),
      toTime: getTimeToProp(toTime),
    }),
  };
};

export default useInitPaginationTimeFilter;
