import Link from "next/link";
import { getFilePath, leveliseCategories } from "../utils";

const NavbarLi = ({ category }) => {
  const hasChildren = category.children && category.children.length > 0;
  const link = `/listings/?search_category=${category.name}`;

  return (
    <li className="nav-item">
      <Link
        href={link}
        className={`nav-link category-nav-link ${hasChildren ? "" : "false"}`}
      >
        {category.image && (
          <div className="category-navbar-img">
            <img
              src={getFilePath(category.image)}
              height="20px"
              width="20px"
            />
          </div>
        )}
        <span>{category.name}</span>
        {hasChildren && <i className="bx bx-chevron-right"></i>}
      </Link>

      {hasChildren && (
        <ul className="dropdown-menu">
          {category.children.map((categoryChild) => (
            <NavbarLi category={categoryChild} key={categoryChild.name} />
          ))}
        </ul>
      )}
    </li>
  );
};

const CategoriesNavbar = ({ categories: baseCategories }) => {
  const categories = leveliseCategories(baseCategories);

  return (
    <ul className="dropdown-menu">
      {categories.map((fCategory) => (
        <NavbarLi category={fCategory} key={fCategory.name} />
      ))}
    </ul>
  );
};

export default CategoriesNavbar;
