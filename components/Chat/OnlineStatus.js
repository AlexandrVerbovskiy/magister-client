const OnlineStatus = ({ online }) => {
  if (online) {
    return <span className="status-online"></span>;
  }

  return <span className="status-busy"></span>;
};

export default OnlineStatus;
