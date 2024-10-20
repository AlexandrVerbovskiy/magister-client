import BaseModal from "./BaseModal";
import { getFilePath } from "../../utils";
import useListingCategorySelect from "../../hooks/useListingCategorySelect";

const BurgerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="25"
    fill="currentColor"
    className="bi bi-list"
    viewBox="0 0 16 16"
    style={{ marginRight: "5px" }}
  >
    <path
      fillRule="evenodd"
      d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
    />
  </svg>
);

const BackIcon = () => (
  <i className="bx bx-chevron-left category-option-show-children"></i>
);

const CategoryOption = ({
  category,
  active = false,
  onClick,
  Icon = null,
  className = "",
}) => {
  return (
    <div
      className={`categories-select-option${active ? " active" : ""}${
        className ? ` ${className}` : ""
      }`}
      onClick={onClick}
    >
      {Icon && <Icon />}

      {!Icon && category.image && (
        <img
          width="25px"
          height="25px"
          className="category-option-image"
          src={category.customImage
            ? category.image
            : getFilePath(category.image)}
        />
      )}

      {!Icon && !category.image && <div className="category-option-image" />}

      <span className="category-option-name">{category.name}</span>
      {category.countChildren ? (
        <i className="bx bx-chevron-right category-option-show-children"></i>
      ) : (
        <></>
      )}
    </div>
  );
};

const ListingCategorySelect = ({
  active,
  setActive,
  categories,
  onChange,
  otherCategoryParentId = null,
  setSelectedCategoryInfo = () => {},
  selectedCategoryId = null,
  needAll = false,
  needBack = false,
}) => {

  const {
    firstLevelRef,
    secondLevelRef,
    thirdLevelRef,
    handleScrollToFirstElement,
    handleScrollToSecondElement,
    handleOptionClick,
    selectedByLevels,
  } = useListingCategorySelect({
    active,
    selectedCategoryId,
    categories,
    setSelectedCategoryInfo,
    onChange,
    setActive,
    otherCategoryParentId,
    parentPadding: 20,
  });

  return (
    <BaseModal
      className="category-select-modal"
      active={active}
      closeModal={() => setActive(false)}
    >
      <div
        className="d-flex w-100 h-100"
        style={{
          overflowX: "hidden",
        }}
      >
        <div
          ref={firstLevelRef}
          className="categories-select-level-column sidebar-left"
        >
          {needAll && (
            <CategoryOption
              key="all"
              category={{ image: null, name: "All" }}
              onClick={() =>
                handleOptionClick(null, "firstLevel", false, category.parentId)
              }
              active={false}
              Icon={BurgerIcon}
            />
          )}

          {categories["firstLevel"].map((category) => (
            <CategoryOption
              key={category.id}
              category={category}
              onClick={() =>
                handleOptionClick(
                  category.id,
                  "firstLevel",
                  !!category.countChildren,
                  category.parentId
                )
              }
              active={category.id == selectedByLevels["firstLevel"]}
            />
          ))}
        </div>
        <div
          ref={secondLevelRef}
          className="categories-select-level-column sidebar-left"
        >
          {selectedByLevels["firstLevel"] && (
            <>
              {needAll && (
                <CategoryOption
                  key="all"
                  category={{ image: null, name: "All" }}
                  onClick={() =>
                    handleOptionClick(
                      null,
                      "secondLevel",
                      false,
                      category.parentId
                    )
                  }
                  active={false}
                  Icon={BurgerIcon}
                />
              )}

              {categories["secondLevel"]
                .filter(
                  (category) =>
                    category.parentId == selectedByLevels["firstLevel"]
                )
                .map((category) => (
                  <CategoryOption
                    key={category.id}
                    category={category}
                    onClick={() =>
                      handleOptionClick(
                        category.id,
                        "secondLevel",
                        !!category.countChildren,
                        category.parentId
                      )
                    }
                    active={category.id == selectedByLevels["secondLevel"]}
                  />
                ))}

              {categories["secondLevel"]?.length > 0 && needBack && (
                <CategoryOption
                  key="back"
                  category={{ image: null, name: "Go Back" }}
                  onClick={handleScrollToFirstElement}
                  active={false}
                  Icon={BackIcon}
                  className="d-lg-none"
                />
              )}
            </>
          )}
        </div>
        <div
          ref={thirdLevelRef}
          className="categories-select-level-column sidebar-left"
        >
          {selectedByLevels["secondLevel"] && (
            <>
              {needAll && (
                <CategoryOption
                  key="all"
                  category={{ image: null, name: "All" }}
                  onClick={() =>
                    handleOptionClick(
                      null,
                      "thirdLevel",
                      false,
                      category.parentId
                    )
                  }
                  active={false}
                  Icon={BurgerIcon}
                />
              )}

              {categories["thirdLevel"]
                .filter(
                  (category) =>
                    category.parentId == selectedByLevels["secondLevel"]
                )
                .map((category) => (
                  <CategoryOption
                    key={category.id}
                    onClick={() =>
                      handleOptionClick(
                        category.id,
                        "thirdLevel",
                        false,
                        category.parentId
                      )
                    }
                    active={category.id == selectedByLevels["thirdLevel"]}
                    category={category}
                  />
                ))}

              {categories["thirdLevel"]?.length > 0 && needBack && (
                <CategoryOption
                  key="back"
                  category={{ image: null, name: "Go Back" }}
                  onClick={handleScrollToSecondElement}
                  active={false}
                  Icon={BackIcon}
                  className="d-lg-none"
                />
              )}
            </>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default ListingCategorySelect;
