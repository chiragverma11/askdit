import { cn } from "@/lib/utils";
import { PostLinkValidator } from "@/lib/validators/post";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { z } from "zod";
import { Button } from "./ui/Button";

export type LinkContent = Pick<z.infer<typeof PostLinkValidator>, "content">;

interface LinkPostProps extends LinkContent {
  title: string;
}

const LinkPost: FC<LinkPostProps> = ({ content, title }) => {
  return (
    <div className="relative w-full cursor-pointer overflow-hidden rounded-2xl border border-default/30">
      <Link
        href={content.url}
        target="_blank"
        className="no-underline hover:no-underline active:no-underline"
      >
        {content.ogImage ? (
          <div className="relative h-full w-full overflow-hidden bg-black/50">
            <Image
              src={content.ogImage}
              alt=""
              className="-z-10 h-full w-full scale-[1.2] object-cover blur-xl"
              priority={true}
              sizes="(max-width: 768px) 80vw, (max-width: 1280px) 50vw, 33vw"
              fill
              unoptimized
            />
            <div
              className="relative h-56 max-h-[100vw] w-full sm:h-60"
              style={{
                maxHeight: "min(100vh,46vw)",
              }}
            >
              <Image
                src={content.ogImage}
                alt={title}
                className="h-full w-full object-contain"
                priority={true}
                sizes="(max-width: 768px) 80vw, (max-width: 1280px) 50vw, 33vw"
                fill
                unoptimized
              />
            </div>
          </div>
        ) : null}
        <div
          className={cn(
            "flex items-center justify-between px-4 py-2",
            content.ogImage ? "border-t border-default/30" : "",
          )}
        >
          <span className="hover:underline">{content.domain}</span>
          <Button
            variant={"outline"}
            className="rounded-full border border-default ring-0"
            size={"sm"}
          >
            Open
          </Button>
        </div>
      </Link>
    </div>
  );
};

export default LinkPost;
