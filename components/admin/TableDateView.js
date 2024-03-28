import { fullTimeConverter, timeConverter } from "../../utils";
import Tooltip from "./Tooltip";

const TableDateView = ({ date }) => {
  return (
    <Tooltip title={fullTimeConverter(date)}>
      <div className="font-medium text-sky-500 overflow-separate">
        <div>{timeConverter(date)}</div>
      </div>
    </Tooltip>
  );
};

export default TableDateView;
