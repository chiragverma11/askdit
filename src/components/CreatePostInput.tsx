import UserAvatar from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import { type Session } from "next-auth";
import Link from "next/link";
import { FC } from "react";
import { Icons } from "./Icons";
import { buttonVariants } from "./ui/Button";

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
        "mx-auto flex w-full items-center bg-emphasis md:rounded-xl md:border md:border-default/25",
        className,
      )}
      {...props}
    >
      <div className="flex h-14 w-full items-center gap-3 px-4">
        <div className="relative">
          <Link href={`/u/${session.user.username}`}>
            <UserAvatar user={session.user} />
          </Link>
          <span className="absolute bottom-[0.01rem] right-[0.025rem] h-3 w-3 rounded-full border border-emphasis bg-green-500 ring-2 ring-emphasis"></span>
        </div>

        <div
          className={cn(
            "inline-flex w-full items-center gap-2 rounded-lg bg-subtle px-6 text-sm text-subtle backdrop-blur-xl focus-within:border focus-within:border-default/90 focus-within:bg-subtle/60 focus-within:transition-colors dark:focus-within:bg-default",
          )}
        >
          {href ? (
            <Link href={`${href}`} className="w-full focus:outline-none">
              <input
                type="text"
                className="w-full bg-transparent py-2.5 font-semibold placeholder:text-subtle focus-visible:outline-none"
                placeholder="Create Post"
                tabIndex={-1}
              />
            </Link>
          ) : (
            <input
              type="text"
              className="w-full bg-transparent py-2.5 font-semibold placeholder:text-subtle focus-visible:outline-none"
              placeholder="Create Post"
              tabIndex={-1}
            />
          )}
        </div>
        <div className="flex items-center">
          <Link
            href={`${href}/?media=true`}
            className={cn(
              "aspect-square hover:bg-subtle",
              buttonVariants({ size: "icon", variant: "ghost" }),
            )}
          >
            <Icons.imageIcon className="text-subtle" />
          </Link>
          <Link
            href={`${href}/?url`}
            className={cn(
              "aspect-square hover:bg-subtle",
              buttonVariants({ size: "icon", variant: "ghost" }),
            )}
          >
            <Icons.link2 className="text-subtle" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreatePostInput;
