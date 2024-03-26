import { useEffect, useState } from "react";
import BaseModal from "../BaseModal";
import { getFilePath } from "../../../utils";
import { useRouter } from "next/router";

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

const CategoryOption = ({ category, active = false, onClick, Icon = null }) => {
  return (
    <a
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

      {!Icon && !category.image && <div className="category-option-image" />}

      <span className="category-option-name">{category.name}</span>
      {category.countChildren ? (
        <i className="bx bx-chevron-right category-option-show-children"></i>
      ) : (
        <></>
      )}
    </a>
  );
};

const ListingPopup = ({ active, setActive, categories }) => {
  const router = useRouter();

  const [selectedFirstCategory, setSelectedFirstCategory] = useState(null);
  const [selectedSecondCategory, setSelectedSecondCategory] = useState(null);

  const defaultFirstCategory = () => {
    const categoryInfo = categories["firstLevel"][0];
    if (categoryInfo) return categoryInfo.id;
    return null;
  };

  const defaultSecondCategory = (firstCategory) => {
    const categoryInfo = categories["secondLevel"].filter(
      (category) => category.parentId == firstCategory
    )[0];
    if (categoryInfo) return categoryInfo.id;
    return null;
  };

  useEffect(() => {
    const first = defaultFirstCategory();

    if (!first) {
      return;
    }

    setSelectedFirstCategory(first);
    const second = defaultSecondCategory(first);

    if (second) {
      setSelectedSecondCategory(second);
    }
  }, []);

  const handleClickCategory = (categoryName = null) => {
    let link = "/listing-list";

    if (categoryName) {
      link += `?categories=${categoryName}`;
    }

    if (window.location.pathname.includes("/listing-list/")) {
      router.push(link).then(() => router.reload());
    } else {
      router.push(link);
    }
  };

  const handleClickFirstCategory = (categoryId) => {
    const newCategoryInfo = categories["firstLevel"].find(
      (c) => c.id === categoryId
    );

    if (newCategoryInfo.countChildren) {
      setSelectedFirstCategory(categoryId);
      const second = defaultSecondCategory(categoryId);

      if (second) {
        setSelectedSecondCategory(second);
      }
    } else {
      handleClickCategory(newCategoryInfo.name);
    }
  };

  const handleClickSecondCategory = (categoryId) => {
    const newCategoryInfo = categories["secondLevel"].find(
      (c) => c.id === categoryId
    );

    if (newCategoryInfo.countChildren) {
      setSelectedSecondCategory(categoryId);
    } else {
      handleClickCategory(newCategoryInfo.name);
    }
  };

  const handleClickThirdAllCategory = () => {
    const newCategoryInfo = categories["secondLevel"].find(
      (c) => c.id === selectedSecondCategory
    );
    handleClickCategory(newCategoryInfo.name);
  };

  const handleClickSecondAllCategory = () => {
    const newCategoryInfo = categories["firstLevel"].find(
      (c) => c.id === selectedFirstCategory
    );
    handleClickCategory(newCategoryInfo.name);
  };

  return (
    <BaseModal
      className="category-select-modal category-navbar-popup"
      active={active}
      toggleActive={() => setActive(false)}
      needCloseBtn={false}
    >
      <div className="categories-select-level-column sidebar-left">
        <CategoryOption
          key="all"
          category={{ image: null, name: "All" }}
          Icon={BurgerIcon}
          onClick={() => handleClickCategory()}
        />

        {categories["firstLevel"].map((category) => (
          <CategoryOption
            key={category.id}
            category={category}
            active={selectedFirstCategory == category.id}
            onClick={() => handleClickFirstCategory(category.id)}
          />
        ))}
      </div>

      <div className="categories-select-level-column sidebar-left">
        <CategoryOption
          key="all"
          category={{ image: null, name: "All" }}
          Icon={BurgerIcon}
          onClick={() => handleClickSecondAllCategory()}
        />

        {categories["secondLevel"]
          .filter((category) => category.parentId == selectedFirstCategory)
          .map((category) => (
            <CategoryOption
              key={category.id}
              category={category}
              active={selectedSecondCategory == category.id}
              onClick={() => handleClickSecondCategory(category.id)}
            />
          ))}
      </div>

      <div className="categories-select-level-column sidebar-left">
        <CategoryOption
          key="all"
          category={{ image: null, name: "All" }}
          Icon={BurgerIcon}
          onClick={() => handleClickThirdAllCategory()}
        />

        {categories["thirdLevel"]
          .filter((category) => category.parentId == selectedSecondCategory)
          .map((category) => (
            <CategoryOption
              key={category.id}
              category={category}
              onClick={() => handleClickCategory(category.name)}
            />
          ))}
      </div>
    </BaseModal>
  );
};

export default ListingPopup;
