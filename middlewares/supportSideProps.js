import userSideProps from "./userSideProps";

const supportSideProps = async (context) => {
  const { props } = await userSideProps(context);
  const { user } = props;

  if (!user || (user.role !== "admin" && user.role !== "support")) {
    return {
      notFound: true,
    };
  }

  return { props: { user, pageType: "admin" } };
};

export default supportSideProps;
