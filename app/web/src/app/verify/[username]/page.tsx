import { VerificationForm } from "@components/user/VerificationForm";

export default async function VerificationPage({
    params,
  }: {
    params: { username: string };
  }){
    return <VerificationForm username={params.username}/>
}
