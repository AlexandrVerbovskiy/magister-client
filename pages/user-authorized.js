import {getMyInfo} from "../services/auth";
import {notAuthSideProps} from "../middlewares";

const UserAuthorized = () => {
};

export const getServerSideProps = async (context) => {
    const baseSideProps = await notAuthSideProps(context);
    
    if (baseSideProps.notFound) {
        return baseSideProps;
    }

    try {
        const {token} = context.query;
        const user = await getMyInfo({Bearer: token});

        const router = context.res;
        router.setHeader(
            "Set-Cookie",
            `Bearer=${token}; Max-Age=${60 * 60 * 24 * 30 * 3}; Path=/`
        );

        let redirectLink = "/";

        if (user.needSetPassword) {
            redirectLink = "/more-info-competing";
        } else if (user.needRegularViewInfoForm) {
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
