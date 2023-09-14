import { Image as LucideImage, Link2 } from "lucide-react";
import { type Session } from "next-auth";
import UserAvatar from "@/components/UserAvatar";
import { FC } from "react";
import { Button } from "./ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CreatePostInputProps extends React.HTMLAttributes<HTMLDivElement> {
  session: Session;
  href?: String;
}

const CreatePostInput: FC<CreatePostInputProps> = ({
  className,
  session,
  href,
  ...props
}) => {
  return (
    <div
      className={cn(
        "mx-auto flex h-16 w-full items-center rounded-xl border border-default/25 bg-emphasis",
        className,
      )}
      {...props}
    >
      <div className="flex w-full items-center gap-3 px-4">
        <div className="relative">
          <Link href={`/u/${session.user.username}`}>
            <UserAvatar user={session.user} />
          </Link>
          <span className="absolute bottom-[0.01rem] right-[0.025rem] h-3 w-3 rounded-full border border-emphasis bg-green-500 ring-2 ring-emphasis"></span>
        </div>

        <div
          className={cn(
            "inline-flex w-full items-center gap-2 rounded-lg bg-subtle px-6 text-sm text-subtle backdrop-blur-xl focus-within:border-default/90 focus-within:bg-subtle/60 focus-within:transition-colors dark:focus-within:bg-default",
          )}
        >
          {href ? (
            <Link href={`${href}`} className="w-full">
              <input
                type="text"
                className="w-full bg-transparent py-2.5 font-semibold placeholder:text-subtle focus-visible:outline-none"
                placeholder="Create Post"
              />
            </Link>
          ) : (
            <input
              type="text"
              className="w-full bg-transparent py-2.5 font-semibold placeholder:text-subtle focus-visible:outline-none"
              placeholder="Create Post"
            />
          )}
        </div>
        <div className="hidden sm:flex sm:items-center">
          <Button
            size={"icon"}
            variant={"ghost"}
            className="aspect-square hover:bg-subtle"
          >
            <LucideImage className="text-subtle" />
          </Button>
          <Button
            size={"icon"}
            variant={"ghost"}
            className="aspect-square hover:bg-subtle"
          >
            <Link2 className="text-subtle" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostInput;
