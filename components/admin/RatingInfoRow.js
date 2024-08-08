import SingleRatingStar from "./SingleRatingStar";
import SubInfoRowWithChild from "./SubInfoRowWithChild";

const RatingInfoRow = ({ label, value, bold = false }) => (
  <SubInfoRowWithChild label={label} bold={bold}>
    <SingleRatingStar value={value} count={1} commentName="" />
  </SubInfoRowWithChild>
);

export default RatingInfoRow;
