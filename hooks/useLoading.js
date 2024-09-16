import { useEffect, useState } from "react";

const useLoading = () => {
  const [dots, setDots] = useState("...");

  useEffect(() => {
    const interval = setInterval(
      () => setDots((prev) => (prev.length > 2 ? "." : prev + ".")),
      400
    );
    return () => clearInterval(interval);
  }, []);

  return dots;
};

export default useLoading;
