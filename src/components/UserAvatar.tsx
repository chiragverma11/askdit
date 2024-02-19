import { Avatar, AvatarFallback } from "@/components/ui/Avatar";
import { AvatarProps } from "@radix-ui/react-avatar";
import { User } from "next-auth";
import Image from "next/image";
import { FC } from "react";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "image" | "name">;
  imageClassName?: string;
}

const UserAvatar: FC<UserAvatarProps> = ({
  user,
  imageClassName,
  ...props
}) => {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className="relative aspect-square h-full w-full">
          <Image
            fill
            src={user.image}
            className={imageClassName}
            alt="Profile Picture"
            referrerPolicy="no-referrer"
            sizes="(max-width: 768px) 10vw, (max-width: 1200px) 8vw, 5vw"
            unoptimized
            priority={true}
          />
        </div>
      ) : (
        <AvatarFallback className="bg-highlight">
          <span className="sr-only">{user?.name}</span>
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
