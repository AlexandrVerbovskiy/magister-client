const CheckboxList = ({ options, checkedList, onCheckClick }) => {
  return (
    <ul className="space-y-2">
      {options.map((option) => {
        const title = option.title;
        const value = option.value;
        const checked = checkedList.includes(value);

        return (
          <li key={value}>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox"
                value={value}
                checked={checked}
                onChange={() => onCheckClick(value)}
              />
              <span className="text-sm text-slate-600 dark:text-slate-300 font-medium ml-2">
                {title}
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
};

export default CheckboxList;
