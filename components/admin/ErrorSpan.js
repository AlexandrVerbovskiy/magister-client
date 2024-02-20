import { useEffect, useRef } from "react";

const ErrorSpan = ({ error }) => {
  const errorRef = useRef(null);

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
      <div ref={errorRef} className="text-red-500 text-sm">
        {error}
      </div>
    );
  }
};

export default ErrorSpan;
