import { getMyInfoByCookie } from "../services";

const userSideProps = async (context) => {
  try {
    const cookies = context.req.cookies;
    const authToken = cookies["auth-token"] ?? null;
    const user = await getMyInfoByCookie(authToken);

    return { props: { user } };
  } catch (e) {
    context.res.setHeader("Set-Cookie", `auth-token=; Max-Age=-1; Path=/`);

    return { props: { user: null } };
  }
};

export default userSideProps;
