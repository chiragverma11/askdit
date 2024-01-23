import { cn } from "@/lib/utils";
import { PostLinkValidator } from "@/lib/validators/post";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { z } from "zod";
import { Icons } from "./Icons";
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
        prefetch={false}
      >
        {content.ogImage ? (
          <div className="relative h-full w-full overflow-hidden bg-background/50">
            <Image
              src={content.ogImage}
              alt=""
              className="-z-10 h-full w-full scale-[1.2] object-cover blur-xl"
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

export const LinkPostCompactPreview: FC<Pick<LinkPostProps, "content">> = ({
  content,
}) => {
  return (
    <Link
      href={content.url}
      target="_blank"
      className="relative h-full w-full no-underline hover:no-underline active:no-underline"
      prefetch={false}
    >
      {content.ogImage ? (
        <div className=" relative h-full w-full overflow-hidden bg-background/50">
          <Image
            src={content.ogImage}
            alt=""
            className="h-full w-full object-cover"
            sizes="(max-width: 768px) 80vw, (max-width: 1280px) 50vw, 33vw"
            fill
            unoptimized
          />
        </div>
      ) : (
        <Icons.link className="h-5 w-5" />
      )}
      <span className="absolute bottom-0 right-0 rounded-tl-md bg-zinc-300 p-1 text-zinc-700">
        <Icons.externalLink className="h-3.5 w-3.5" strokeWidth={2.25} />
      </span>
    </Link>
  );
};

export default LinkPost;
