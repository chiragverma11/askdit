import MainContentWrapper from "@/components/layout/MainContentWrapper";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function NotFound() {
  return (
    <MainContentWrapper>
      <div className="fixed inset-0 flex max-h-[700px] w-full flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-7xl font-bold sm:text-8xl">404</h1>
          <p className="text-lg font-medium sm:text-xl">Page not found</p>
          <p className="text-subtle sm:text-lg">
            We can&apos;t find the page you&apos;re looking for
          </p>
        </div>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline" }), "w-fit")}
        >
          Take me home
        </Link>
      </div>
    </MainContentWrapper>
  );
}
