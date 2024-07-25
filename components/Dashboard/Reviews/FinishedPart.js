import Link from "next/link";

const FinishedPart = ({ isReviewerOwner = true }) => {
  const link = isReviewerOwner
    ? "/dashboard/orders/?type=owner"
    : "/dashboard/orders/";

  return (
    <div
      style={{
        marginTop: "60px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <img
        height="300px"
        width="300px"
        src="/images/how-it-works/earn-money.png"
      />

      <h3 className="mt-4 mb-4">
        Thank you for your review!
        <br /> We appreciate your feedback
      </h3>

      <Link className="base-main-button" href={link}>
        Go to orders
      </Link>
    </div>
  );
};

export default FinishedPart;
