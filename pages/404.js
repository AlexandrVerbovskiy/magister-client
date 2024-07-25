import { useEffect, useState } from "react";
import Error404 from "../components/404Error/ErrorContent";
import SignInForm from "../components/_App/SignInForm";
import { getSession } from "next-auth/react";
import Loader from "../components/Shared/Loader";

const ErrorPage = () => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      setIsAuth(!!session?.user);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <Loader loading={loading} />
      {isAuth ? <Error404 /> : <SignInForm />}
    </>
  );
};

export default ErrorPage;
