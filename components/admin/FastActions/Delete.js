const Delete = ({ onDeleteClick }) => {
  return (
    <button
      type="button"
      aria-controls="danger-modal"
      onClick={onDeleteClick}
      className="bg-rose-100 hover:bg-rose-200 text-rose-500 items-center hover:text-rose-600 rounded-full py-2 px-4"
    >
      Delete
    </button>
  );
};

export default Delete;
