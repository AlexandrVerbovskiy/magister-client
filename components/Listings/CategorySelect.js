import { useState } from "react";
import { getFilePath } from "../../utils";
import ListingCategorySelect from "../_App/ListingCategorySelect";
import ErrorSpan from "../ErrorSpan";

const CategorySelect = ({
  categories,
  selectedCategoryId,
  categoryError,
  handleChangeCategory,
}) => {
  const [active, setActive] = useState(false);
  const [selectedCategoryInfo, setSelectedCategoryInfo] = useState({});

  return (
    <>
      <div
        className="form-control d-flex align-items-center cursor-pointer"
        onClick={() => setActive(true)}
        style={{
          maxWidth: "100%",
        }}
      >
        {selectedCategoryInfo.image && (
          <img
            width="25px"
            height="25px"
            className="category-option-image"
            style={{ marginRight: "5px" }}
            src={getFilePath(selectedCategoryInfo.image)}
          />
        )}
        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
          {selectedCategoryInfo.name ?? ""}
        </span>
      </div>

      <ErrorSpan error={categoryError} />

      <ListingCategorySelect
        active={active}
        setActive={setActive}
        categories={categories}
        onChange={handleChangeCategory}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryInfo={setSelectedCategoryInfo}
      />
    </>
  );
};

export default CategorySelect;
