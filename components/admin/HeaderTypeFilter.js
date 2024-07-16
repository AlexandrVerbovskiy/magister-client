const activeButtonClasses =
  "inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-transparent shadow-sm bg-indigo-500 text-white duration-150 ease-in-out";
const inactiveButtonClasses =
  "inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 duration-150 ease-in-out";

const activeSpanClasses = "ml-1 text-indigo-200";
const inactiveSpanClasses = "ml-1 text-slate-400 dark:text-slate-500";

const HeaderTypeFilter = ({ options, selected, onChange }) => {
  const handleClick = (value) => {
    if (value != selected) {
      onChange(value);
    }
  };

  return (
    <div className="mb-4 sm:mb-0">
      <ul className="flex flex-wrap -m-1">
        {options.map((option) => (
          <li className="m-1" key={option.value}>
            <button
              type="button"
              className={
                option.value == selected
                  ? activeButtonClasses
                  : inactiveButtonClasses
              }
              onClick={() => handleClick(option.value)}
            >
              {option.title}{" "}
              <span
                className={
                  option.value == selected
                    ? activeSpanClasses
                    : inactiveSpanClasses
                }
              >
                {option.count}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HeaderTypeFilter;
