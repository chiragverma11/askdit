import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-[90vh] w-full items-center justify-center">
      <div className="flex flex-col justify-center gap-4 text-center">
        <h2 className="text-lg">
          Sorry, there aren’t any communities on Reddit with that name.
        </h2>
        <p className="text-sm">
          This community may have been banned or the community name is
          incorrect.
        </p>
        <div className="mx-auto mt-4 flex gap-4">
          <Link
            href="/r/create"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "bg-emphasis hover:bg-subtle",
            )}
          >
            Create Community
          </Link>
          <Link href="/" className={cn(buttonVariants({ size: "sm" }))}>
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
