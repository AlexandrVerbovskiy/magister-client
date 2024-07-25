import { fullDateConverter, dateConverter } from "../../utils";
import Tooltip from "./Tooltip";

const TableDateView = ({ date }) => {
  return (
    <Tooltip title={fullDateConverter(date)}>
      <div className="font-medium overflow-separate">
        <div>{dateConverter(date)}</div>
      </div>
    </Tooltip>
  );
};

export default TableDateView;
