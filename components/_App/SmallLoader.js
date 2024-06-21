const SmallLoader = () => {
  return (
    <div class="d-flex justify-content-center">
      <div
        class="spinner-border"
        role="status"
        style={{
          color: "var(--mainColor)",
          width: "1rem",
          height: "1rem",
          borderWidth: "2px",
        }}
      >
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default SmallLoader;
