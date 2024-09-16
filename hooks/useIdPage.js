import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { IndiceContext } from "../contexts";

const useIdPage = ({
  observingField = "id",
  getPagePropsFunc,
  baseProps,
  onUpdate = null,
}) => {
  const router = useRouter();
  const [props, setProps] = useState(baseProps);
  const [authToken, setAuthToken] = useState(baseProps.authToken);
  const { authToken: sessionAuthToken } = useContext(IndiceContext);
  const firstUpdateRef = useRef(true);

  useEffect(() => {
    setAuthToken(sessionAuthToken);
  }, [sessionAuthToken]);

  const onUpdateField = async (field) => {
    const newProps = await getPagePropsFunc({
      field,
      authToken,
      currentProps: props,
    });

    setProps((prev) => {
      const result = { ...prev, ...newProps };
      result[observingField] = field;
      return result;
    });

    if (onUpdate) {
      onUpdate(newProps, field);
    }
  };

  useEffect(() => {
    if (firstUpdateRef.current) {
      firstUpdateRef.current = false;
    } else {
      onUpdateField(router.query[observingField]);
    }
  }, [router.query[observingField]]);

  return { props, authToken: sessionAuthToken };
};

export default useIdPage;
