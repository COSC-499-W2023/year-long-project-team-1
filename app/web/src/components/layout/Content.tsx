import { CSS } from "@lib/utils";

const contentStyles: CSS = {
  maxWidth: "93vw",
  minWidth: "20rem",
  padding: "1rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "0.5rem",
};

interface ContentProps {
  children?: React.ReactNode;
}

export default async function Content({ children }: ContentProps) {
  return <div style={contentStyles}>{children}</div>;
}
