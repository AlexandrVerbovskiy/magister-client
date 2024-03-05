import { middlewareCallbackWrapper } from "../utils";
import userSideProps from "./userSideProps";

const notAuthSideProps = async (context, callback=null) => {
  const { props } = await userSideProps(context);
  const { user } = props;

  if (user) {
    return {
      notFound: true,
    };
  }

  return await middlewareCallbackWrapper({
    callback,
    context,
    props,
  });
};

export default notAuthSideProps;
