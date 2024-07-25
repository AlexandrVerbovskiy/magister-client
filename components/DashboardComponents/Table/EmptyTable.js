const EmptyTable = ({ entityName, imgSrc = "/images/contact.png" }) => {
  return (
    <div className="send-create-listing-category-notification">
      <div className="image-parent" style={{ width: "300px", height: "300px" }}>
        <img
          src={imgSrc}
          alt="image"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            width: "auto",
            height: "auto",
          }}
        />
      </div>

      <div className="description mt-1">
        Empty table. There are no {entityName} yet
      </div>
    </div>
  );
};

export default EmptyTable;
