import { useContext } from "react";
import Error404 from "../components/404Error/ErrorContent";
import SignInForm from "../components/_App/SignInForm";
import { IndiceContext } from "../contexts";

const ErrorPage = () => {
  const { isAuth } = useContext(IndiceContext);

  if (isAuth) {
    return <Error404 />;
  } else {
    return <SignInForm />;
  }
};

export default ErrorPage;
