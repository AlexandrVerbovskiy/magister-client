import { getSession } from "next-auth/react";
import { getMyInfo } from "../services";
import { middlewareCallbackWrapper } from "../utils";

const userSideProps = async ({context, callback = null, baseProps = null}) => {
  const res = { sessionUser: null };

  try {
    const resGetSession = await getSession(context);

    if (resGetSession) {
      const authToken = resGetSession.user.authToken;
      const sessionUser = await getMyInfo(authToken);

      if (!sessionUser) throw new Error("User not found");

      res["sessionUser"] = sessionUser;
      res["authToken"] = authToken;
    }
  } catch (e) {
    /*Object.keys(context.req.cookies).forEach((cookieName) => {
      context.res.setHeader("Set-Cookie", `${cookieName}=; Max-Age=-1; Path=/`);
    });*/

    res["sessionUser"] = null;
    res["authToken"] = null;
  }

  return await middlewareCallbackWrapper({
    callback,
    res,
    context,
    baseProps
  });
};

export default userSideProps;
