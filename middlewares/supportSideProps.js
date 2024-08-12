import { middlewareCallbackWrapper } from "../utils";
import userSideProps from "./userSideProps";

const supportSideProps = async ({
  context,
  callback = null,
  baseProps = null,
}) => {
  const { props } = await userSideProps({ context });

  const { sessionUser, authToken } = props;

  if (
    !sessionUser ||
    (sessionUser?.role !== "admin" && sessionUser?.role !== "support")
  ) {
    return {
      notFound: true,
    };
  }

  const res = { sessionUser, authToken, pageType: "admin" };

  return await middlewareCallbackWrapper({
    callback,
    res,
    context,
    baseProps,
  });
};

export default supportSideProps;
