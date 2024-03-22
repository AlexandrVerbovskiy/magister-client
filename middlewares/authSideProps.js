import { middlewareCallbackWrapper } from "../utils";
import userSideProps from "./userSideProps";

const authSideProps = async (context, callback = null) => {
  const { props } = await userSideProps(context);
  const { sessionUser } = props;

  if (!sessionUser) {
    return {
      notFound: true,
    };
  }

  return await middlewareCallbackWrapper({
    callback,
    res: props,
    context,
  });
};

export default authSideProps;
