const SmallLoader = () => {
  return (
    <div className="d-flex justify-content-center">
      <div
        className="spinner-border"
        role="status"
        style={{
          width: "1rem",
          height: "1rem",
          borderWidth: "2px",
        }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default SmallLoader;
