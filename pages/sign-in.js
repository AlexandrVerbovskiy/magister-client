import SignInForm from "../components/_App/SignInForm";
import { notAuthSideProps } from "../middlewares";

const SignIn = () => {
  return <SignInForm />;
};

export const getServerSideProps = (context) =>
  notAuthSideProps({ context, baseProps: { pageTitle: "Sign in" } });

export default SignIn;
