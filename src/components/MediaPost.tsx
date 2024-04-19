import { cn } from "@/lib/utils";
import { MediaPostValidator } from "@/lib/validators/post";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useMemo, useRef } from "react";
import { z } from "zod";
import { Icons } from "./Icons";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselSlideCounter,
  CarouselSlideSelectorDot,
} from "./ui/Carousel";

export type MediaContent = Pick<z.infer<typeof MediaPostValidator>, "content">;

interface MediaPostProps extends MediaContent {}

const MediaPost: FC<MediaPostProps> = ({ content }) => {
  if (content.type === "IMAGE") {
    return <ImageMedia images={content.images} />;
  }

  return null;
};

const ImageMedia: FC<Pick<MediaContent["content"], "images">> = ({
  images,
}) => {
  const captionRef = useRef<(HTMLDivElement | null)[]>([]);
  const selectorDotRef = useRef<HTMLDivElement>(null);

  const hasCaption = useMemo(
    () => images.some((image) => !!image.caption),
    [images],
  );

  const aspectRatio = useMemo(
    () =>
      Math.max(
        Math.min(
          ...images.map((image) => {
            const params = new URL(image.url).searchParams;

            return Number(params.get("width")) / Number(params.get("height"));
          }),
        ),
        8 / 9,
      ),
    [images],
  );

  useEffect(() => {
    if (!captionRef.current[0]) return;

    const height = Math.max(
      ...captionRef.current.map((e) => e?.clientHeight || 0),
    );

    selectorDotRef.current?.style.setProperty(
      "--media-caption-height",
      `${height}px`,
    );
  }, []);

  if (images.length === 1) {
    return (
      <div className="relative z-[1] h-full w-full cursor-pointer overflow-hidden rounded-2xl after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:ring-1 after:ring-inset after:ring-default/30">
        <Link
          href={images[0].url}
          className="not-prose relative block w-full overflow-hidden bg-highlight/50"
          style={{ aspectRatio }}
          prefetch={false}
          target="_blank"
        >
          <Image
            src={images[0].url}
            alt={images[0].caption || "Image"}
            className="h-full w-full object-cover"
            sizes="(max-width: 1280px) 80vw, 60vw"
            fill
          />
        </Link>
        {hasCaption ? (
          <div className="flex w-full grow items-center bg-subtle px-3 py-2">
            <p className="not-prose text-sm">{images[0].caption}</p>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <Carousel
      className="relative z-[1] h-full w-full cursor-pointer overflow-hidden rounded-2xl after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:ring-1 after:ring-inset after:ring-default/30"
      opts={{ duration: 20 }}
    >
      <CarouselContent>
        {images.map((image, index) => {
          return (
            <CarouselItem key={image.id} className="flex flex-col">
              <Link
                href={image.url}
                className="not-prose relative block w-full overflow-hidden bg-highlight/50"
                style={{ aspectRatio }}
                prefetch={false}
                target="_blank"
              >
                <Image
                  src={image.url}
                  alt={image.caption || `Image ${index + 1}`}
                  className="h-full w-full object-cover"
                  sizes="(max-width: 1280px) 80vw, 60vw"
                  fill
                />
              </Link>
              {hasCaption ? (
                <div
                  className="flex w-full grow items-center bg-subtle px-3 py-2"
                  ref={(element) => (captionRef.current[index] = element)}
                >
                  <p className="not-prose text-sm">{image.caption}</p>
                </div>
              ) : null}
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious
        className="hidden bg-black/60 text-white hover:bg-black/60 disabled:opacity-10 lg:inline-flex lg:h-11 lg:w-11"
        variant="secondary"
      />
      <CarouselNext
        className="hidden bg-black/60 text-white hover:bg-black/60 disabled:hidden lg:inline-flex lg:h-11 lg:w-11"
        variant="secondary"
      />
      <CarouselSlideCounter />
      <CarouselSlideSelectorDot
        ref={selectorDotRef}
        className={cn(
          hasCaption
            ? "bottom-[calc(var(--media-caption-height)+1rem)]"
            : "bottom-4",
        )}
      />
    </Carousel>
  );
};

export const MediaPostCompactPreview: FC<Pick<MediaPostProps, "content">> = ({
  content,
}) => {
  if (content.type === "IMAGE") {
    return (
      <div className=" relative h-full w-full overflow-hidden bg-highlight/50">
        <Image
          src={content.images[0].url}
          alt=""
          className="h-full w-full object-cover"
          sizes="33vw"
          fill
        />
        <span className="absolute bottom-0 right-0 rounded-tl-md bg-zinc-300 p-1 text-zinc-700">
          <Icons.galleryHorizontalEnd
            className="h-3.5 w-3.5"
            strokeWidth={2.25}
          />
        </span>
      </div>
    );
  }

  return null;
};

export default MediaPost;
