const EmptyTable = ({entityName}) => {
  return (
    <div className="send-create-listing-category-notification">
      <div className="image-parent" style={{ width: "300px", height: "300px" }}>
        <img src="/images/contact.png" alt="image" />
      </div>

      <div className="description">Empty table. There are no {entityName} yet</div>
    </div>
  );
};

export default EmptyTable;
