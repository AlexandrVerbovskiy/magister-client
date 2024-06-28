import { useEffect, useRef } from "react";

const ErrorSpan = ({ error, style = {} }) => {
  const errorRef = useRef(null);

  useEffect(() => {
    if (errorRef.current) {
      const { top, bottom } = errorRef.current.getBoundingClientRect();
      const isInViewport = top >= 64 && bottom <= window.innerHeight;

      if (!isInViewport) {
        errorRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [error]);

  if (error) {
    return (
      <div
        style={style}
        ref={errorRef}
        className="text-rose-500 text-sm error-span"
      >
        {error}
      </div>
    );
  }
};

export default ErrorSpan;
