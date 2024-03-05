import Content from "@components/layout/Content";

export default async function UploadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Content>{children}</Content>;
}
