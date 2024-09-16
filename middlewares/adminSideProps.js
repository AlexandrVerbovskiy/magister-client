import { middlewareCallbackWrapper } from "../utils";
import userSideProps from "./userSideProps";

const adminSideProps = async ({
  context,
  callback = null,
  baseProps = null,
}) => {
  const { props } = await userSideProps({context});
  const { sessionUser, authToken } = props;

  if (!sessionUser || sessionUser?.role !== "admin") {
    return {
      notFound: true,
    };
  }

  const res = { sessionUser, pageType: "admin", authToken };

  return await middlewareCallbackWrapper({
    callback,
    res,
    context,
    baseProps,
  });
};

export default adminSideProps;
