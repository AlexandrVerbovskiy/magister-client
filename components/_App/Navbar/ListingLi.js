const ListingLi = ({ categoriesLength, handleListingClick }) => {
  return (
    <li className="nav-item">
      <a
        onClick={handleListingClick}
        href="#"
        className={`${
          categoriesLength > 0 ? "dropdown-toggle " : ""
        }nav-link d-none d-xl-block`}
      >
        Listings
      </a>

      <a href="/listing-list" className={`nav-link d-block d-xl-none`}>
        Listings
      </a>
    </li>
  );
};

export default ListingLi;
