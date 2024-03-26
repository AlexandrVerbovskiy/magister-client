const middlewareCallbackWrapper = async ({ callback, res, context }) => {
  if (callback) {
    try {
      const callbackRes = await callback({ baseSideProps: res, context });

      if (callback.notFound) {
        return {
          notFound: true,
        };
      }

      res = { ...res, ...callbackRes };
    } catch (e) {
      console.error("Middleware error: " + e.message);
      const status = e.status;

      if (status === 404) {
        return {
          notFound: true,
        };
      }

      return {
        props: {
          globalError: { status: status, message: e.message },
        },
      };
    }
  }

  return { props: res };
};

export default middlewareCallbackWrapper;
