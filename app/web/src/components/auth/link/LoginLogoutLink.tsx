import { auth, authManager } from "src/auth";
import { LogoutLink } from "./LogoutLink";
import { LoginLink } from "./LoginLink";
import { SignupLink } from "./SignupLink";

export const LoginLogoutLink = async () => {
  const session = await auth();

  if (session?.user) {
    return <LogoutLink />;
  }
  return (
    <>
      <SignupLink />
      <LoginLink authManager={authManager} />
    </>
  );
};
