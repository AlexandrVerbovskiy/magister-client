import { useState } from "react";
import { getFilePath } from "../../../utils";
import ErrorSpan from "../ErrorSpan";
import ListingCategorySelectPopup from "./ListingCategorySelectPopup";

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
        className="form-input w-full cursor-pointer listing-category-select"
        onClick={(e) => {
          e.stopPropagation();
          setActive(true);
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
        <span>{selectedCategoryInfo.name ?? ""}</span>
      </div>

      <ErrorSpan error={categoryError} />

      <ListingCategorySelectPopup
        active={active}
        setActive={setActive}
        categories={categories}
        onChange={handleChangeCategory}
        setSelectedCategoryInfo={setSelectedCategoryInfo}
        selectedCategoryId={selectedCategoryId}
      />
    </>
  );
};

export default CategorySelect;
