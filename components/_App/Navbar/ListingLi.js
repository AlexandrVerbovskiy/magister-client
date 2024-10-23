const ListingLi = ({ handleListingClick }) => {
  return (
    <li className="nav-item">
      <a
        onClick={(e) => {
          e.preventDefault();
          handleListingClick(e);
        }}
        href="#"
        className={`nav-link d-none d-xl-block`}
      >
        Listings
      </a>

      <a
        onClick={(e) => {
          e.preventDefault();
          handleListingClick(e);
        }}
        href="#"
        className={`nav-link d-block d-xl-none`}
      >
        Listings
      </a>
    </li>
  );
};

export default ListingLi;
