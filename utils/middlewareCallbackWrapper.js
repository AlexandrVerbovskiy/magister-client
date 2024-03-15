const middlewareCallbackWrapper = async ({ callback, res, context }) => {
  if (callback) {
    //try {
    const callbackRes = await callback({ baseSideProps: res, context });

    if (callback.notFound) {
      return {
        notFound: true,
      };
    }

    res = { ...res, ...callbackRes };
    /*} catch (e) {
      console.error("Middleware error: " + e.message);
      return {
        notFound: true,
      };
    }*/
  }

  return { props: res };
};

export default middlewareCallbackWrapper;
