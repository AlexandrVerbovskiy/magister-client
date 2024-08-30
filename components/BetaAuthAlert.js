import Link from "next/link";

const BetaAuthAlert = () => {
  return (
    <div
      className={`beta-auth-alert notification-alert alert alert-dismissible fade show`}
      role="alert"
    >
      <strong>We are currently in beta testing. </strong>To join the waiting
      list for our test, please register on our platform.
      <div>
        <Link href="/sign-in" className="default-btn">
          Join Waiting List
        </Link>
      </div>
    </div>
  );
};

export default BetaAuthAlert;
