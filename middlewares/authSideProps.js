import userSideProps from "./userSideProps";

const authSideProps = async (context) => {
  const { props } = await userSideProps(context);
  const { user } = props;

  if (!user) {
    return {
      notFound: true,
    };
  }

  return { props };
};

export default authSideProps;
