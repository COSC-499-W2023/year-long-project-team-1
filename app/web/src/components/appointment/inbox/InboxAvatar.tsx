import { CSS } from "@lib/utils";
import Image from "next/image";

interface AvatarProps {
  avatarUrl: string;
  alt?: string;
  style?: CSS;
}

export const InboxAvatar = ({ avatarUrl, alt, style }: AvatarProps) => {
  const avatarStyle: CSS = {
    borderRadius: "100%",
    ...style,
  };
  return (
    <Image
      src={avatarUrl}
      alt={alt ?? `Avatar for ${avatarUrl}`}
      width={50}
      height={50}
      style={avatarStyle}
    />
  );
};
