import userSideProps from "./userSideProps";

const supportSideProps = async (context, callback = null) => {
  const { props } = await userSideProps(context);
  const { user, authToken } = props;

  if (!user || (user.role !== "admin" && user.role !== "support")) {
    return {
      notFound: true,
    };
  }

  const res = { user, authToken, pageType: "admin" };

  return await middlewareCallbackWrapper({
    callback,
    context,
    res,
  });
};

export default supportSideProps;
