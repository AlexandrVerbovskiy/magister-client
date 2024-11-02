import {
  calculateFee,
  moneyFormatVisual,
} from "../../../utils";

const ContractDetailsLight = ({ price, fee }) => {
  const totalFee = calculateFee(price, fee, true);
  const totalPrice = price + totalFee;

  return (
    <div className="listings-widget listings_contact_details">
      <h3>Worker Details</h3>

      <div>
        <div
          className="d-flex justify-content-between"
          style={{ marginTop: "10px", marginBottom: "10px" }}
        >
          <div>{moneyFormatVisual(price)}</div>
        </div>

        <div
          className="d-flex justify-content-between"
          style={{ marginTop: "10px", marginBottom: "10px" }}
        >
          <div>Service Fee</div>
          <div>{moneyFormatVisual(totalFee)}</div>
        </div>
      </div>

      <ul>
        <li className="d-flex justify-content-between px-0">
          <div>Total:</div> <div>{moneyFormatVisual(totalPrice)}</div>
        </li>
      </ul>
    </div>
  );
};

export default ContractDetailsLight;
