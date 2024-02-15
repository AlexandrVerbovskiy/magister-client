import userSideProps from "./userSideProps";

const adminSideProps = async (context) => {
  const { props } = await userSideProps(context);
  const { user, authToken } = props;

  if (!user || user.role !== "admin") {
    return {
      notFound: true,
    };
  }

  return { props: { user, pageType: "admin", authToken } };
};

export default adminSideProps;
