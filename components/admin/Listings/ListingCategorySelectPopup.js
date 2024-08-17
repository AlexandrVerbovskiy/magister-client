import { useEffect, useState } from "react";
import { getFilePath } from "../../../utils";
import ModalBasic from "../ModalBasic";

const CategoryOption = ({ category, active = false, onClick }) => {
  return (
    <div
      className={`categories-select-option${active ? " active" : ""}`}
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
      <span className="category-option-name">{category.name}</span>
      {category.countChildren ? (
        <i className="bx bx-chevron-right category-option-show-children"></i>
      ) : (
        <></>
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
  const [selectedByLevels, setSelectedByLevels] = useState({
    firstLevel: null,
    secondLevel: null,
    thirdLevel: null,
  });

  useEffect(() => {
    let foundCategory = {};
    let searchId = selectedCategoryId;

    Object.keys(categories).forEach((level) => {
      const resSearch =
        categories[level].filter(
          (category) => category.id == selectedCategoryId
        )[0] ?? null;

      if (resSearch) {
        foundCategory = resSearch;
      }
    });

    setSelectedCategoryInfo(foundCategory);

    do {
      Object.keys(categories).forEach((level) => {
        const foundCategory = categories[level].filter((category) => {
          if (searchId == "-") {
            return (
              category.parentId == otherCategoryParentId &&
              category.id == searchId
            );
          } else {
            return category.id == searchId;
          }
        })[0];

        if (foundCategory) {
          searchId = foundCategory.parentId;

          setSelectedByLevels((prev) => {
            const res = { ...prev };
            res[level] = foundCategory.id;
            return res;
          });
        }
      });
    } while (searchId);
  }, [selectedCategoryId]);

  const handleOptionClick = (
    categoryId,
    level,
    hasChild = false,
    parentId = null
  ) => {
    if (!hasChild) {
      onChange(categoryId, parentId);
      setActive(false);
      setSelectedByLevels({
        firstLevel: null,
        secondLevel: null,
        thirdLevel: null,
      });
      return;
    }

    setSelectedByLevels((prev) => {
      let res = { ...prev };
      res[level] = categoryId;

      if (level == "firstLevel") {
        res = { ...res, secondLevel: null, thirdLevel: null };
      }

      if (level == "secondLevel") {
        res = { ...res, thirdLevel: null };
      }

      return res;
    });
  };

  return (
    <ModalBasic
      title="Select Category"
      modalOpen={active}
      setModalOpen={setActive}
    >
      <div className="category-select-modal">
        <div className="flex w-100" style={{ height: "max-content" }}>
          <div className="categories-select-level-column sidebar-left">
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

          {selectedByLevels["firstLevel"] && (
            <div className="categories-select-level-column sidebar-left">
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
            </div>
          )}

          {selectedByLevels["secondLevel"] && (
            <div className="categories-select-level-column sidebar-left">
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
            </div>
          )}
        </div>
      </div>
    </ModalBasic>
  );
};

export default ListingCategorySelectPopup;
