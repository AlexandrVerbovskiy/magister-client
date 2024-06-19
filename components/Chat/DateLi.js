import { dateName } from "../../utils";

const DateLi = ({ date }) => {
  return (
    <div className="badge badge-pill badge-light my-3">{dateName(date)}</div>
  );
};

export default DateLi;
