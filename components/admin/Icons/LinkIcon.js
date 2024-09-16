const LinkIcon = ({ color = "#1E293B" }) => {
  return (
    <svg
      width="19"
      height="18"
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="ml-1"
    >
      <path
        d="M10.6875 7.875L16.625 2.25M16.625 2.25H12.6667M16.625 2.25V6M16.625 10.5V14.25C16.625 14.6478 16.4582 15.0294 16.1613 15.3107C15.8643 15.592 15.4616 15.75 15.0417 15.75H3.95833C3.53841 15.75 3.13568 15.592 2.83875 15.3107C2.54181 15.0294 2.375 14.6478 2.375 14.25V3.75C2.375 3.35218 2.54181 2.97064 2.83875 2.68934C3.13568 2.40804 3.53841 2.25 3.95833 2.25H7.91667"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LinkIcon;
