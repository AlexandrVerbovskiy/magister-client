import { useState } from "react";
import { getFilePath } from "../../../utils";
import ErrorSpan from "../ErrorSpan";
import ListingCategorySelectPopup from "./ListingCategorySelectPopup";

const CategorySelect = ({
  categories,
  selectedCategoryId,
  categoryError,
  handleChangeCategory,
  otherCategoryParentId,
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
            width="20px"
            height="20px"
            className="category-option-image"
            style={{ marginRight: "5px" }}
            src={
              selectedCategoryInfo.customImage
                ? selectedCategoryInfo.image
                : getFilePath(selectedCategoryInfo.image)
            }
          />
        )}
        {selectedCategoryInfo.name ? (
          <span>{selectedCategoryInfo.name}</span>
        ) : (
          <span className="text-slate-400">Select Category</span>
        )}
      </div>

      <ErrorSpan error={categoryError} />

      <ListingCategorySelectPopup
        active={active}
        setActive={setActive}
        categories={categories}
        onChange={handleChangeCategory}
        setSelectedCategoryInfo={setSelectedCategoryInfo}
        selectedCategoryId={selectedCategoryId}
        otherCategoryParentId={otherCategoryParentId}
      />
    </>
  );
};

export default CategorySelect;
