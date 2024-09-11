import { useEffect, useState } from "react";
import BaseModal from "../BaseModal";
import { getFilePath, getListingSearchLink } from "../../../utils";
import { useRouter } from "next/router";
import Link from "next/link";

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

const CategoryOption = ({
  category,
  onClick = () => {},
  href = null,
  active = false,
  Icon = null,
}) => {
  return (
    <Link
      className={`categories-select-option${active ? " active" : ""}`}
      onClick={(e) => {
        if (!href) {
          e.preventDefault();
        }

        onClick();
      }}
      href={href ?? "#"}
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
    </Link>
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
    const link = getListingSearchLink(categoryName);
    router.push(link);
    setActive(false);
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

  const firstSelectedCategoryInfo = categories["firstLevel"].find(
    (c) => c.id === selectedFirstCategory
  );

  const secondSelectedCategoryInfo = categories["secondLevel"].find(
    (c) => c.id === selectedSecondCategory
  );

  const firstAllLink = `/listings/`;

  const secondAllLink = firstSelectedCategoryInfo
    ? `listings/?categories=${encodeURIComponent(
        firstSelectedCategoryInfo.name
      )}`
    : firstAllLink;

  const thirdAllLink = secondSelectedCategoryInfo
    ? `listings/?categories=${encodeURIComponent(
        secondSelectedCategoryInfo.name
      )}`
    : secondAllLink;

  const firstLevelCategories = categories["firstLevel"];

  const secondLevelCategories = categories["secondLevel"].filter(
    (category) => category.parentId == selectedFirstCategory
  );

  const thirdLevelCategories = categories["thirdLevel"].filter(
    (category) => category.parentId == selectedSecondCategory
  );

  return (
    <BaseModal
      className="category-select-modal category-navbar-popup"
      active={active}
      closeModal={() => setActive(false)}
      needCloseBtn={false}
    >
      <div className="d-flex w-100" style={{ height: "max-content" }}>
        <div className="categories-select-level-column sidebar-left">
          <CategoryOption
            key="all"
            category={{ image: null, name: "All" }}
            Icon={BurgerIcon}
            href={firstAllLink}
            onClick={() => setActive(false)}
          />

          {firstLevelCategories.map((category) => (
            <CategoryOption
              key={category.id}
              category={category}
              active={selectedFirstCategory == category.id}
              href={
                category.countChildren
                  ? null
                  : `/listings/?categories=${encodeURIComponent(category.name)}`
              }
              onClick={() => {
                if (category.countChildren) {
                  handleClickFirstCategory(category.id);
                } else {
                  setActive(false);
                }
              }}
            />
          ))}
        </div>

        <div className="categories-select-level-column sidebar-left">
          <CategoryOption
            key="all"
            category={{ image: null, name: "All" }}
            Icon={BurgerIcon}
            href={secondAllLink}
            onClick={() => setActive(false)}
          />

          {secondLevelCategories.map((category) => (
            <CategoryOption
              key={category.id}
              category={category}
              active={selectedSecondCategory == category.id}
              href={
                category.countChildren
                  ? null
                  : `/listings/?categories=${encodeURIComponent(category.name)}`
              }
              onClick={() => {
                if (category.countChildren) {
                  handleClickSecondCategory(category.id);
                } else {
                  setActive(false);
                }
              }}
            />
          ))}

          {firstSelectedCategoryInfo && secondLevelCategories.length > 0 && (
            <CategoryOption
              key="-"
              category={{
                image: firstSelectedCategoryInfo.image,
                name: "Others",
              }}
              active={false}
              href={
                "/listings/?others-categories=" + firstSelectedCategoryInfo.id
              }
              onClick={() => setActive(false)}
            />
          )}
        </div>

        <div className="categories-select-level-column sidebar-left">
          <CategoryOption
            key="all"
            category={{ image: null, name: "All" }}
            Icon={BurgerIcon}
            href={thirdAllLink}
            onClick={() => setActive(false)}
          />

          {thirdLevelCategories.map((category) => (
            <CategoryOption
              key={category.id}
              category={category}
              href={`/listings/?categories=${encodeURIComponent(
                category.name
              )}`}
              onClick={() => setActive(false)}
            />
          ))}

          {secondSelectedCategoryInfo && thirdLevelCategories.length > 0 && (
            <CategoryOption
              key="-"
              category={{
                image: secondSelectedCategoryInfo.image,
                name: "Others",
              }}
              active={false}
              href={
                "/listings/?others-categories=" + secondSelectedCategoryInfo.id
              }
              onClick={() => setActive(false)}
            />
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default ListingPopup;
