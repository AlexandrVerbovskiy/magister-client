import { useEffect, useState } from "react";
import BaseModal from "./BaseModal";
import { getFilePath } from "../../utils";

const CategoryOption = ({ category, active = false, onClick, Icon = null }) => {
  return (
    <div
      className={`categories-select-option${active ? " active" : ""}`}
      onClick={onClick}
    >
      {Icon && <Icon />}
      {!Icon && category.image && (
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

const ListingCategorySelect = ({
  active,
  setActive,
  categories,
  onChange,
  setSelectedCategoryInfo = () => {},
  selectedCategoryId = null,
  needAll = false,
}) => {
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
      const needId = searchId;
      searchId = null;

      Object.keys(categories).forEach((level) => {
        const foundCategory = categories[level].filter(
          (category) => category.id == needId
        )[0];

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

  const [selectedByLevels, setSelectedByLevels] = useState({
    firstLevel: null,
    secondLevel: null,
    thirdLevel: null,
  });

  const handleOptionClick = (categoryId, level, hasChild = false) => {
    if (
      !hasChild ||
      (!categoryId &&
        (level == "firstLevel" || !selectedByLevels["firstLevel"]))
    ) {
      onChange(categoryId);
      setActive(false);
      setSelectedByLevels({
        firstLevel: null,
        secondLevel: null,
        thirdLevel: null,
      });
      return;
    }

    if (!categoryId) {
      if (level == "thirdLevel") {
        categoryId =
          selectedByLevels["secondLevel"] ?? selectedByLevels["firstLevel"];
      }

      if (level == "secondLevel") {
        categoryId = selectedByLevels["firstLevel"];
      }

      onChange(categoryId);
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

  const burgerIcon = () => (
    <i
      className="bx bx-menu category-option-show-children"
      style={{ marginRight: "17px" }}
    ></i>
  );

  return (
    <BaseModal
      className="category-select-modal"
      active={active}
      toggleActive={() => setActive(false)}
    >
      <div className="categories-select-level-column sidebar-left">
        {needAll && (
          <CategoryOption
            key="all"
            category={{ image: null, name: "All" }}
            onClick={() => handleOptionClick(null, "firstLevel", false)}
            active={false}
            Icon={burgerIcon}
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
                !!category.countChildren
              )
            }
            active={category.id == selectedByLevels["firstLevel"]}
          />
        ))}
      </div>

      {(needAll || selectedByLevels["firstLevel"]) && (
        <div className="categories-select-level-column sidebar-left">
          {needAll && (
            <CategoryOption
              key="all"
              category={{ image: null, name: "All" }}
              onClick={() => handleOptionClick(null, "secondLevel", false)}
              active={false}
              Icon={burgerIcon}
            />
          )}

          {categories["secondLevel"]
            .filter(
              (category) => category.parentId == selectedByLevels["firstLevel"]
            )
            .map((category) => (
              <CategoryOption
                key={category.id}
                category={category}
                onClick={() =>
                  handleOptionClick(
                    category.id,
                    "secondLevel",
                    !!category.countChildren
                  )
                }
                active={category.id == selectedByLevels["secondLevel"]}
              />
            ))}
        </div>
      )}

      {(needAll || selectedByLevels["secondLevel"]) && (
        <div className="categories-select-level-column sidebar-left">
          {needAll && (
            <CategoryOption
              key="all"
              category={{ image: null, name: "All" }}
              onClick={() => handleOptionClick(null, "thirdLevel", false)}
              active={false}
              Icon={burgerIcon}
            />
          )}

          {categories["thirdLevel"]
            .filter(
              (category) => category.parentId == selectedByLevels["secondLevel"]
            )
            .map((category) => (
              <CategoryOption
                key={category.id}
                onClick={() =>
                  handleOptionClick(category.id, "thirdLevel", false)
                }
                active={category.id == selectedByLevels["thirdLevel"]}
                category={category}
              />
            ))}
        </div>
      )}
    </BaseModal>
  );
};

export default ListingCategorySelect;
