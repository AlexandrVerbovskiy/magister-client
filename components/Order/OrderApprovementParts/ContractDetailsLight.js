import {
  getPriceByDays,
  moneyFormatVisual,
  renterPaysFeeCalculate,
} from "../../../utils";

const ContractDetailsLight = ({ price, startDate, finishDate, fee }) => {
  const clearPrice = getPriceByDays(price, startDate, finishDate);
  const totalFee = renterPaysFeeCalculate(clearPrice, fee);
  const totalPrice = clearPrice + totalFee;

  return (
    <div className="listings-widget listings_contact_details">
      <h3>Rental Details</h3>

      <div>
        <div
          className="d-flex justify-content-between"
          style={{ marginTop: "10px", marginBottom: "10px" }}
        >
          <div>{moneyFormatVisual(clearPrice)}</div>
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
