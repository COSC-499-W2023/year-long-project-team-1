import { VerificationForm } from "@components/registration/VerificationForm";
import { getSession } from "@lib/session";
import { redirect } from "next/navigation";

export default async function VerificationPage({
  params,
}: {
  params: { username: string };
}) {
  const session = await getSession();
  // if user is alrd verified, redirect to homepage
  if (session) {
    redirect("/");
  }
  return <VerificationForm username={params.username} />;
}
