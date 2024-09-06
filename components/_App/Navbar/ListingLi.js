const ListingLi = ({ categoriesLength, handleListingClick }) => {  
  return (
    <li className="nav-item">
      <a
        onClick={(e) => {
          e.preventDefault();
          handleListingClick(e);
        }}
        href="#"
        className={`${
          categoriesLength > 0 ? "dropdown-toggle " : ""
        }nav-link d-none d-xl-block`}
      >
        List An Item
      </a>

      <a
        onClick={(e) => {
          e.preventDefault();
          handleListingClick(e);
        }}
        href="#"
        className={`nav-link d-block d-xl-none`}
      >
        List An Item
      </a>
    </li>
  );
};

export default ListingLi;
