const middlewareCallbackWrapper = async ({ callback, context, res }) => {
  if (callback) {
    try {
      const callbackRes = await callback(context);
      res = { ...res, ...callbackRes };
    } catch (e) {
      console.log("Middleware error: " + e.message);
      return {
        notFound: true,
      };
    }
  }

  return { props: res };
};

export default middlewareCallbackWrapper;
