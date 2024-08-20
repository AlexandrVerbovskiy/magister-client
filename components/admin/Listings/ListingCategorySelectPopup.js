import { getFilePath } from "../../../utils";
import ModalBasic from "../ModalBasic";
import useListingCategorySelect from "../../../hooks/useListingCategorySelect";

const CategoryOption = ({
  category,
  active = false,
  onClick,
  className = "",
  type = "normal",
}) => {
  return (
    <div
      className={`categories-select-option${active ? " active" : ""}${
        className ? ` ${className}` : ""
      }`}
      onClick={onClick}
    >
      {category.image && (
        <img
          width="25px"
          height="25px"
          className="category-option-image"
          src={getFilePath(category.image)}
        />
      )}
      {type == "back" && (
        <svg
          className="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
          viewBox="0 0 12 12"
          style={{ transform: "rotate(90deg)" }}
        >
          <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
        </svg>
      )}
      <span className="category-option-name">{category.name}</span>
      {category.countChildren > 0 && (
        <svg
          className="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400"
          viewBox="0 0 12 12"
          style={{ transform: "rotate(270deg)" }}
        >
          <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
        </svg>
      )}
    </div>
  );
};

const ListingCategorySelectPopup = ({
  active,
  setActive,
  categories,
  onChange,
  otherCategoryParentId,
  setSelectedCategoryInfo = () => {},
  selectedCategoryId = null,
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
  });

  return (
    <ModalBasic
      title="Select Category"
      modalOpen={active}
      setModalOpen={setActive}
    >
      <div className="category-select-modal">
        <div
          className="flex w-full relative"
          style={{ height: "max-content", overflowX: "hidden" }}
        >
          <div
            className="categories-select-level-column sidebar-left"
            ref={firstLevelRef}
          >
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
            className="categories-select-level-column sidebar-left"
            ref={secondLevelRef}
          >
            {selectedByLevels["firstLevel"] && (
              <>
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

                {categories["secondLevel"]?.length > 0 && (
                  <CategoryOption
                    category={{ image: null, name: "Go Back" }}
                    onClick={handleScrollToFirstElement}
                    active={false}
                    className="back-button"
                    type="back"
                  />
                )}
              </>
            )}
          </div>

          <div
            className="categories-select-level-column sidebar-left"
            ref={thirdLevelRef}
          >
            {selectedByLevels["secondLevel"] && (
              <>
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

                {categories["thirdLevel"]?.length > 0 && (
                  <CategoryOption
                    category={{ image: null, name: "Go Back" }}
                    onClick={handleScrollToSecondElement}
                    active={false}
                    className="back-button"
                    type="back"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </ModalBasic>
  );
};

export default ListingCategorySelectPopup;
