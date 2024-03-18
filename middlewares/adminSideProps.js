import { middlewareCallbackWrapper } from "../utils";
import userSideProps from "./userSideProps";

const adminSideProps = async (context, callback = null) => {
  const { props } = await userSideProps(context);
  const { user, authToken } = props;

  if (!user || user.role !== "admin") {
    return {
      notFound: true,
    };
  }

  const res = { user, pageType: "admin", authToken };

  return await middlewareCallbackWrapper({
    callback,
    res,
    context,
  });
};

export default adminSideProps;
