import { getMyInfoByCookie } from "../services";

const userSideProps = async (context) => {
  try {
    const cookies = context.req.cookies;
    const user = await getMyInfoByCookie(cookies);
    return { props: { user } };
  } catch (e) {
    return { props: { user: null } };
  }
};

export default userSideProps;
