import ErrorSpan from "../ErrorSpan";

const Input = ({ type = "text", value, placeholder, error, onInput }) => (
  <div className="form-group">
    <input
      type={type}
      placeholder={placeholder}
      className={`form-control${error ? " is-invalid" : ""}`}
      value={value}
      onInput={onInput}
    />
    
    <ErrorSpan error={error}/>
  </div>
);

export default Input;
