import React, { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { IndiceContext } from "../../contexts";

const PageWrapper = ({ children }) => {
  const router = useRouter();
  const { hasPermission, setLoading } = useContext(IndiceContext);

  useEffect(() => {
    if (hasPermission === null) {
      setLoading(true);
    } else {
      setLoading(false);
    }

    if (!hasPermission && hasPermission !== null) {
      router.push("/");
    }
  }, [hasPermission]);

  if (hasPermission === null) return <></>;

  return children;
};

export default PageWrapper;
