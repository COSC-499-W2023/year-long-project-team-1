import { VerificationForm } from "@components/registration/VerificationForm";

export default async function VerificationPage({
  params,
}: {
  params: { username: string };
}) {
  return <VerificationForm username={params.username} />;
}
