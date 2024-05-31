import { useState } from "react";
import useTimeTypeFilter from "./useTimeTypeFilter";

const useBaseAdminFilter = (props) => {
  const [type, setType] = useState(props.options.type ?? "all");
  const { timeFilterType, geTimeTypeDopProps, handleChangeTimeFilterType } =
    useTimeTypeFilter(props);

  const handleChangeType = (type, rebuild) => {
    setType(type);
    rebuild({ type });
  };

  const getBaseAdminFilterDopProps = () => ({
    ...geTimeTypeDopProps(),
    type: {
      value: type,
      hidden: (value) => value == "all",
    },
  });

  return {
    timeFilterType,
    getBaseAdminFilterDopProps,
    handleChangeTimeFilterType,
    type,
    handleChangeType,
  };
};

export default useBaseAdminFilter;
