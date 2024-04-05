import { Avatar } from "@patternfly/react-core";
import avatarImg from "@assets/pf_avatar.svg";

interface CustomAvatarProps {
  firstName?: string;
  lastName?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  style?: any;
}
export default function CustomAvatar({
  firstName,
  lastName,
  size,
  className,
  style,
}: CustomAvatarProps) {
  const avatarLink =
    firstName && lastName
      ? `https://ui-avatars.com/api/?background=random&name=${firstName}+${lastName}`
      : avatarImg.src;
  return (
    <Avatar
      src={avatarLink}
      alt="Profile picture"
      size={size}
      className={className}
      style={style}
    />
  );
}
