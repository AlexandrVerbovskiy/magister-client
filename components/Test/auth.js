import { useSession, signOut } from "next-auth/react";

const Auth = () => {
  const { data: session } = useSession();
  console.log(session);

  return (
    <div>
      <h2>Test</h2>
      <button
        onClick={() => signOut({ redirect: false, callbackUrl: "/test" })}
      >
        Sign Out
      </button>
    </div>
  );
};

export default Auth;
