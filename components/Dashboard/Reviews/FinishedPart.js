import Link from "next/link";

const FinishedPart = ({ isReviewerOwner = true }) => {
  const link = isReviewerOwner
    ? "/dashboard/bookings?type=owner"
    : "/dashboard/bookings";

  return (
    <div
      style={{
        marginTop: "100px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h3>Thank you for your review! We appreciate your feedback</h3>

      <Link className="base-main-button" href={link}>
        Go to bookings
      </Link>
    </div>
  );
};

export default FinishedPart;
