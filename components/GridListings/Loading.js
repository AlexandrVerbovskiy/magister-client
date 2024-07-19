import { useLoading } from "../../hooks";

const Loading = () => {
  const dots = useLoading();

  return (
    <div className="send-create-listing-category-notification">
      <div className="image-parent">
        <img src="/images/claim-your-business.png" alt="image" />
      </div>

      <div className="description mt-2" style={{ fontSize: "18px" }}>
        Loading{dots}
      </div>
    </div>
  );
};

export default Loading;
