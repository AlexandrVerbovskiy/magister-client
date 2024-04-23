const Switch = ({ title, active, onChange }) => {
  return (
    <div className="form-group switch-form-group">
      <div className="sidebar-widgets">
        <div className="box">
          <span className="title">{title}</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={active}
              onChange={() => onChange(!active)}
            />
            <span></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Switch;
