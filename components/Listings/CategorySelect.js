import { useState } from "react";
import { getFilePath } from "../../utils";
import ListingCategorySelect from "../_App/ListingCategorySelect";

const CategorySelect = ({
  categories,
  selectedCategoryId,
  handleChangeCategory,
  categoryError,
  otherCategoryParentId,
}) => {
  const [active, setActive] = useState(false);
  const [selectedCategoryInfo, setSelectedCategoryInfo] = useState({});

  return (
    <>
      <div
        className={`form-control d-flex align-items-center cursor-pointer ${
          categoryError ? "is-invalid" : ""
        }`}
        onClick={() => setActive(true)}
        style={{
          maxWidth: "100%",
        }}
      >
        {selectedCategoryId ? (
          <>
            {selectedCategoryInfo.image && (
              <img
                width="25px"
                height="25px"
                className="category-option-image"
                style={{ marginRight: "5px" }}
                src={
                  selectedCategoryInfo.customImage
                    ? selectedCategoryInfo.image
                    : getFilePath(selectedCategoryInfo.image)
                }
              />
            )}
            <span className="overflow-separate">
              {selectedCategoryInfo.name ?? ""}
            </span>
          </>
        ) : (
          <span
            className="overflow-separate"
            style={{
              color: "#999999",
            }}
          >
            Select category
          </span>
        )}
      </div>

      <ListingCategorySelect
        active={active}
        setActive={setActive}
        categories={categories}
        onChange={handleChangeCategory}
        selectedCategoryId={selectedCategoryId}
        otherCategoryParentId={otherCategoryParentId}
        setSelectedCategoryInfo={setSelectedCategoryInfo}
        needBack={true}
      />
    </>
  );
};

export default CategorySelect;
