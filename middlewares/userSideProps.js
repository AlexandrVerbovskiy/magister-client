import { getSession } from "next-auth/react";
import { getMyInfo } from "../services";
import { middlewareCallbackWrapper } from "../utils";

const userSideProps = async (context, callback = null) => {
  const res = { user: null };

  try {
    const resGetSession = await getSession(context);

    if (resGetSession) {
      const authToken = resGetSession.user.authToken;
      const user = await getMyInfo(authToken);

      if (!user) throw new Error("User not found");

      res["user"] = user;
      res["authToken"] = authToken;
    }
  } catch (e) {
    Object.keys(context.req.cookies).forEach((cookieName) => {
      context.res.setHeader("Set-Cookie", `${cookieName}=; Max-Age=-1; Path=/`);
    });
    return { props: { user: null } };
  }

  return await middlewareCallbackWrapper({
    callback,
    res,
    context,
  });
};

export default userSideProps;
