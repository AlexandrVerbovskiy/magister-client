import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

const Auth = () => {
  const { data: session } = useSession();
  const router = useRouter();
  console.log(session);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <div>
      <h2>Test</h2>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default Auth;
