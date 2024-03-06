const Delete = ({ onDeleteClick }) => {
  return (
    <button
      type="button"
      aria-controls="danger-modal"
      onClick={onDeleteClick}
      className="text-rose-500 hover:text-rose-600 rounded-full"
    >
      <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
        <path d="M13 15h2v6h-2zM17 15h2v6h-2z" />
        <path d="M20 9c0-.6-.4-1-1-1h-6c-.6 0-1 .4-1 1v2H8v2h1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1V13h1v-2h-4V9zm-6 1h4v1h-4v-1zm7 3v9H11v-9h10z" />
      </svg>
    </button>
  );
};

export default Delete;
