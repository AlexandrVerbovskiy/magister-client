import { getMyInfo } from "../services/auth";
import { notAuthSideProps } from "../middlewares";
import env from "../env";

const UserAuthorized = () => {};

export const getServerSideProps = async (context) => {
  const baseSideProps = await notAuthSideProps(context);

  if (baseSideProps.notFound) {
    return baseSideProps;
  }

  try {
    const { token } = context.query;
    const user = await getMyInfo(token);

    const router = context.res;

    let expirationDate = new Date();
    expirationDate.setDate(
      expirationDate.getDate() + env.REMEMBER_COOKIES_DAYS
    );

    router.setHeader(
      "Set-Cookie",
      `${
        env.AUTH_COOKIE_NAME
      }=${token}; expires=${expirationDate.toUTCString()}; Path=/`
    );

    let redirectLink = "/";

    if (user.needRegularViewInfoForm) {
      redirectLink = "/settings/profile-edit";
    }

    return {
      redirect: {
        destination: redirectLink,
        permanent: false,
      },
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
};

export default UserAuthorized;
