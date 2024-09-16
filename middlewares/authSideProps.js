import { middlewareCallbackWrapper } from "../utils";
import userSideProps from "./userSideProps";

const authSideProps = async ({
  context,
  callback = null,
  baseProps = null,
}) => {
  const { props } = await userSideProps({context});
  const { sessionUser } = props;

  if (!sessionUser) {
    const cookies = context.req.headers.cookie;

    if (cookies) {
      const cookieArray = cookies.split(";");

      cookieArray.forEach((cookie) => {
        const [name] = cookie.split("=");
        context.res.setHeader(
          "Set-Cookie",
          `${name}=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict`
        );
      });
    }

    return {
      notFound: true,
    };
  }

  return await middlewareCallbackWrapper({
    callback,
    res: props,
    context,
    baseProps,
  });
};

export default authSideProps;
