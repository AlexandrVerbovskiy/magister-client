import { useContext } from "react";
import { IndiceContext } from "../../contexts";
import { generateProfileFilePath } from "../../utils";

const SearchHeader = ({ filter, setFilter }) => {
  const { sessionUser } = useContext(IndiceContext);

  const photo = generateProfileFilePath(sessionUser?.photo);

  return (
    <div className="chat-sidebar-header d-flex align-items-center">
      <div className="avatar me-2">
        <img
          src={photo}
          width="40"
          height="40"
          className="rounded-circle"
          alt="image"
          style={{ width: "40px", height: "40px" }}
        />
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="form-group position-relative mb-0 w-100"
      >
        <label>
          <i className="bx bx-search"></i>
        </label>
        <input
          value={filter}
          type="text"
          className="form-control"
          placeholder="Search here..."
          onInput={(e) => setFilter(e.target.value)}
        />
      </form>
    </div>
  );
};

export default SearchHeader;
