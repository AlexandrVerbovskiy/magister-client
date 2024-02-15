import { getSession } from "next-auth/react";
import { getMyInfo } from "../services";

const userSideProps = async (context) => {
  try {
    const resGetSession = await getSession(context);

    if (!resGetSession) return { props: { user: null } };

    const authToken = resGetSession.user.authToken;
    const user = await getMyInfo(authToken);

    if (!user) throw new Error("User not found");

    return { props: { user, authToken } };
  } catch (e) {
    console.log(e);
    /*Object.keys(context.req.cookies).forEach((cookieName) => {
      context.res.setHeader("Set-Cookie", `${cookieName}=; Max-Age=-1; Path=/`);
    });*/
    return { props: { user: null } };
  }
};

export default userSideProps;
