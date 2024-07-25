const Switch = ({
  id,
  checked,
  changeChecked,
  onText = null,
  offText = null,
}) => {
  return (
    <div className="flex items-center">
      <div className="form-switch">
        <input
          type="checkbox"
          id={id}
          className="sr-only"
          checked={checked}
          onChange={changeChecked}
          name={id}
        />
        <label className="bg-slate-400 dark:bg-slate-700" htmlFor={id}>
          <span className="bg-white shadow-sm" aria-hidden="true"></span>
          <span className="sr-only">Enable smart sync</span>
        </label>
      </div>

      {((checked && onText) || (!checked && offText)) && (
        <div className="text-sm text-slate-400 dark:text-slate-500 italic ml-2">
          {checked ? onText : offText}
        </div>
      )}
    </div>
  );
};

export default Switch;
