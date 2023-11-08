import { toast } from "@/hooks/use-toast";
import { trpc } from "@/lib/trpc";
import { PostLinkValidator } from "@/lib/validators/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { getHotkeyHandler, useDebouncedValue } from "@mantine/hooks";
import { PostType } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SubmitPostTitle from "./SubmitPostTitle";
import { Button } from "./ui/Button";
import { DotWave } from "@uiball/loaders";

interface CreateLinkPostProps extends React.HTMLAttributes<HTMLDivElement> {
  communityId: string;
}

type FormData = z.infer<typeof PostLinkValidator>;

const CreateLinkPost: FC<CreateLinkPostProps> = ({
  communityId,
  className,
}) => {
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const postType: PostType = "LINK";

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, dirtyFields },
    trigger,
    getValues,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(PostLinkValidator),
    defaultValues: {
      title: "",
      content: { url: "" },
      communityId,
      type: postType,
    },
  });

  const [debouncedUrl] = useDebouncedValue(watch("content.url"), 300);

  const { ref: titleRef, ...rest } = register("title");

  const { mutate: createPost, isLoading } =
    trpc.post.createCommunityPost.useMutation({
      onSuccess(data) {
        const newPathname = pathname
          .split("/")
          .slice(0, -1)
          .concat(["post", data.postId])
          .join("/");
        toast({
          description: "Your post has been created successfully.",
        });
        router.push(newPathname);
      },
    });

  const onSubmit = async (data: FormData) => {
    const payload = {
      title: data.title,
      content: data.content,
      communityId,
      type: postType,
    };

    createPost(payload);
  };

  const fetchMetadata = useCallback(
    async (url: string, signal: AbortSignal) => {
      const res = await fetch(`/api/link?url=${url}`, { signal: signal });
      const result: {
        success: 0 | 1;
        meta?: {
          title: string;
          image: { url?: string };
        };
      } = await res.json();

      if (result.success === 1) {
        const newUrl = new URL(url);

        const hostName = newUrl.hostname.replace("www.", "");

        setValue("content.domain", hostName);
        result.meta?.image.url
          ? setValue("content.ogImage", result.meta?.image?.url)
          : null;
      }

      if (!dirtyFields.title) {
        if (result.meta?.title) {
          setValue("title", result.meta?.title);
        }
      }
    },
    [dirtyFields.title, setValue],
  );

  useEffect(() => {
    let controller: AbortController;
    setTimeout(async () => {
      const result = await trigger("content.url");
      if (result) {
        controller = new AbortController();
        setIsFetchingMetadata(true);
        await fetchMetadata(debouncedUrl, controller.signal);
        setIsFetchingMetadata(false);
      }
    }, 100);

    return () => {
      try {
        controller?.abort();
        setIsFetchingMetadata(false);
      } catch (error) {}
    };
  }, [debouncedUrl, trigger, fetchMetadata]);

  return (
    <div className={className}>
      <form onSubmit={handleSubmit(onSubmit)} id="communityPostLinkForm">
        <div className="prose prose-stone w-full dark:prose-invert">
          <div className="relative">
            <SubmitPostTitle
              titleLength={watch("title").length}
              titleRef={titleRef}
              rest={rest}
              onKeyDown={getHotkeyHandler([
                [
                  "mod+Enter",
                  () => {
                    submitButtonRef.current?.click();
                  },
                ],
              ])}
            />
          </div>
          <div className="min-h-[100px]">
            <div className="relative">
              <input
                type="text"
                className="w-full bg-transparent px-1 pr-6 focus:outline-none"
                placeholder="Url"
                autoComplete="off"
                {...register("content.url")}
              />
              {isFetchingMetadata ? (
                <span className="absolute right-0 top-2">
                  <DotWave size={20} speed={1} color="gray" />
                </span>
              ) : null}
            </div>
          </div>
          <div className="mt-2 flex w-full items-center justify-between">
            <p className="hidden text-sm text-gray-500 md:inline">
              Url should start with <span className="font-bold">http://</span>{" "}
              or <span className="font-bold">https://</span>
            </p>
            <Button
              type="submit"
              form="communityPostLinkForm"
              className="self-end px-6 py-1 font-semibold"
              isLoading={isLoading}
              ref={submitButtonRef}
              disabled={isFetchingMetadata}
            >
              Post
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateLinkPost;
