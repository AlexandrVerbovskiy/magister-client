const ShowMore = ({ showMoreClick, showMore, ariaControls }) => {
  return (
    <button
      className={`text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400 ${
        showMore && "rotate-180"
      }`}
      aria-expanded={showMore}
      onClick={() => showMoreClick()}
      aria-controls={ariaControls}
    >
      <span className="sr-only">Menu</span>
      <svg className="w-8 h-8 fill-current" viewBox="0 0 32 32">
        <path d="M16 20l-5.4-5.4 1.4-1.4 4 4 4-4 1.4 1.4z" />
      </svg>
    </button>
  );
};

export default ShowMore;
