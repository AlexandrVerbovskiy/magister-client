import { useState } from "react";

const useTimeTypeFilter = (pageProps) => {
  const [timeFilterType, setTimeFilterType] = useState(
    pageProps.options.timeFilterType
  );

  const geTimeTypeDopProps = () => ({
    timeFilterType: {
      value: timeFilterType,
      name: "time-filter-type",
      hidden: (value) => value == "last-month",
    },
  });

  const handleChangeTimeFilterType = (value, rebuild) => {
    setTimeFilterType(value);
    rebuild({ timeFilterType: value });
  };

  return { timeFilterType, geTimeTypeDopProps, handleChangeTimeFilterType };
};

export default useTimeTypeFilter;
