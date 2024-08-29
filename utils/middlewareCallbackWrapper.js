import HttpError from "./HttpError";

const middlewareCallbackWrapper = async ({
  callback,
  res,
  context,
  baseProps,
}) => {
  if (callback) {
    try {
      const callbackRes = await callback({ baseSideProps: res, context });

      if (callbackRes.notFound) {
        return {
          notFound: true,
        };
      }

      if (callbackRes.redirect) {
        return callbackRes;
      }

      res = { ...res, ...callbackRes, ...baseProps };
    } catch (e) {
      console.error("Middleware error: " + e.message);

      let status = e.status ?? null;

      if (e instanceof HttpError) {
        status = e.statusCode;
      } else {
        status = e.status ?? null;
      }

      if (status === 404) {
        return {
          notFound: true,
        };
      }

      return {
        props: {
          ...res,
          globalError: { status: status, message: e.message },
        },
      };
    }
  }

  return { props: res };
};

export default middlewareCallbackWrapper;
