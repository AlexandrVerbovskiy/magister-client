import { getSession } from "next-auth/react";
import { getMyInfo } from "../services";
import { middlewareCallbackWrapper } from "../utils";

const userSideProps = async (context, callback = null) => {
  try {
    const resGetSession = await getSession(context);

    const res = { user: null };

    if (resGetSession) {
      const authToken = resGetSession.user.authToken;
      const user = await getMyInfo(authToken);

      if (!user) throw new Error("User not found");

      res["user"] = user;
      res["authToken"] = authToken;
    }

    return await middlewareCallbackWrapper({
      callback,
      res,
      context,
    });
  } catch (e) {
    Object.keys(context.req.cookies).forEach((cookieName) => {
      context.res.setHeader("Set-Cookie", `${cookieName}=; Max-Age=-1; Path=/`);
    });
    return { props: { user: null } };
  }
};

export default userSideProps;
