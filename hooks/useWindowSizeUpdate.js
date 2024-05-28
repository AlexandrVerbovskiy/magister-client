import { useEffect } from "react";

const useWindowSizeUpdate = (callback) => {
  useEffect(() => {
    if (!window) {
      return;
    }
    
    window.addEventListener("resize", callback);

    return () => window.removeEventListener("resize", callback);
  }, [window]);
};

export default useWindowSizeUpdate;
