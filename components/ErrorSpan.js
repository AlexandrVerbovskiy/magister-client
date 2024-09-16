import { useEffect, useRef } from "react";

const ErrorSpan = ({ error, className = "base", style = {} }) => {
  const errorRef = useRef(null);

  className = `invalid-feedback${className ? ` ${className}` : ""}`;

  useEffect(() => {
    if (errorRef.current) {
      errorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [error]);

  if (error) {
    return (
      <div ref={errorRef} className={className} style={style}>
        {error}
      </div>
    );
  }
};

export default ErrorSpan;
