import Link from "next/link";

const ApprovedSection = ({ type }) => {
  return (
    <div
      style={{
        marginTop: "60px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "50px",
      }}
    >
      <img
        height="300px"
        width="300px"
        src="/images/how-it-works/rental-exchange.png"
      />

      <h3 className="mt-4 mb-4">
        {type == "finish" ? "The task finished!" : "The task starts!"}
      </h3>

      <Link className="base-main-button" href="/dashboard/orders/">
        Go to bookings page
      </Link>
    </div>
  );
};

export default ApprovedSection;
