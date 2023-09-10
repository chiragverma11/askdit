import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-[90vh] w-full items-center justify-center">
      <div className="flex flex-col justify-center gap-4 text-center">
        <h2 className="text-lg">
          Sorry, there&apos;s nothing here. This post might have been removed.
        </h2>
        <div className="mx-auto mt-4 flex gap-4">
          <Link href="/" className={cn(buttonVariants({ size: "sm" }))}>
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
