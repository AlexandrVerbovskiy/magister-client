import { useEffect } from "react";

const useWindowSizeUpdate = (callback, relations = []) => {
  useEffect(() => {
    if (!window) {
      return;
    }

    window.addEventListener("resize", callback);

    return () => window.removeEventListener("resize", callback);
  }, [window, ...relations]);
};

export default useWindowSizeUpdate;
