const ListingLi = ({ categoriesLength, handleListingClick }) => {
  return (
    <li className="nav-item">
      <a
        onClick={handleListingClick}
        href="#"
        className={`${categoriesLength > 0 ? "dropdown-toggle " : ""}nav-link`}
      >
        Listings
      </a>
    </li>
  );
};

export default ListingLi;
