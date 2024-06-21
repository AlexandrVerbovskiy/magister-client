import { useState } from "react";
import useTimeTypeFilter from "./useTimeTypeFilter";

const useBaseAdminFilter = ({ props, defaultTypeValue = null }) => {
  if (!defaultTypeValue) {
    defaultTypeValue = props.options.type ?? "all";
  }

  const [type, setType] = useState(props.options.type ?? defaultTypeValue);
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
      hidden: (value) => value == defaultTypeValue,
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
