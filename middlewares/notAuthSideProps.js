import userSideProps from "./userSideProps";

const notAuthSideProps = async (context) => {
  const { props } = await userSideProps(context);
  const { user } = props;

  if (user) {
    return {
      notFound: true,
    };
  }

  return { props };
};

export default notAuthSideProps;
