import { getMyInfoByCookie } from "../services";
import env from "../env"

const userSideProps = async (context) => {
  try {
    const authToken = context.req.cookies[env.AUTH_COOKIE_NAME] ?? null;
    const user = await getMyInfoByCookie(authToken);

    return { props: { user } };
  } catch (e) {
    context.res.setHeader("Set-Cookie", `${env.AUTH_COOKIE_NAME}=; Max-Age=-1; Path=/`);
    return { props: { user: null } };
  }
};

export default userSideProps;
