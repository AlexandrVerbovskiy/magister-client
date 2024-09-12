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
