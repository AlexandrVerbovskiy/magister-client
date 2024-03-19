import Link from "next/link";
import CategoriesNavbar from "../../CategoriesNavbar";
import { useContext } from "react";
import { IndiceContext } from "../../../contexts";

const ListingLi = () => {
  const { categories = {} } = useContext(IndiceContext);
  const categoriesLength = Object.values(categories).reduce(
    (acc, curr) => acc + curr.length,
    0
  );

  return (
    <li className="nav-item">
      <Link
        href="/listing-list"
        className={`${categoriesLength > 0 ? "dropdown-toggle " : ""}nav-link`}
      >
        Listings
      </Link>

      {categoriesLength > 0 && <CategoriesNavbar categories={categories} />}
    </li>
  );
};

export default ListingLi;
