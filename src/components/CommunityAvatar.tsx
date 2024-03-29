import { cn, getDefaultCommunityBg } from "@/lib/utils";
import { FC } from "react";
import UserAvatar from "./UserAvatar";

interface CommunityAvatarProps extends React.ComponentPropsWithoutRef<"span"> {
  communityName: string;
  image: string | null;
}

const CommunityAvatar: FC<CommunityAvatarProps> = ({
  image,
  communityName,
  className,
  ...props
}) => {
  if (!image) {
    return (
      <span
        className={cn(
          "flex aspect-square h-8 w-8 items-center justify-center rounded-full text-lg font-bold text-zinc-950",
          getDefaultCommunityBg({
            communityName,
          }),
          className,
        )}
      >
        r/
      </span>
    );
  }

  return (
    <UserAvatar
      className={cn("h-8 w-8", className)}
      imageClassName="object-cover"
      user={{
        name: communityName,
        image: image,
      }}
      {...props}
    />
  );
};

export default CommunityAvatar;
