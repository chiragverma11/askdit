import { toast } from "@/hooks/use-toast";
import { trpc } from "@/lib/trpc";
import { PostLinkValidator } from "@/lib/validators/post";
import { PostType } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TextareaAutosize from "react-textarea-autosize";
import { zodResolver } from "@hookform/resolvers/zod";
import { POST_TITLE_LENGTH } from "@/lib/config";
import { getHotkeyHandler, useDebouncedValue } from "@mantine/hooks";
import { Button } from "./ui/Button";

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

  const fetchUrlMetadata = useCallback(
    async (url: string) => {
      const res = await fetch(`/api/link?url=${url}`);
      const result: {
        success: 0 | 1;
        meta?: {
          title: string;
          description: string;
          image: { url: string };
        };
      } = await res.json();

      if (result.success === 1) {
        const newUrl = new URL(url);

        console.log(newUrl);

        const hostName = newUrl.hostname.replace("www.", "");

        setValue("content.domain", hostName);
        result.meta?.image.url
          ? setValue("content.ogImage", result.meta?.image.url)
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
    setTimeout(async () => {
      const result = await trigger("content.url");
      result && fetchUrlMetadata(debouncedUrl);
    }, 100);
  }, [debouncedUrl, fetchUrlMetadata, trigger]);

  return (
    <div className={className}>
      <form onSubmit={handleSubmit(onSubmit)} id="communityPostLinkForm">
        <div className="prose prose-stone w-full dark:prose-invert">
          <div className="relative">
            <TextareaAutosize
              maxLength={POST_TITLE_LENGTH}
              ref={(e) => {
                titleRef(e);
              }}
              placeholder="Title"
              className="w-full resize-none overflow-hidden bg-transparent pr-12 text-2xl font-bold focus:outline-none lg:pr-10 lg:text-4xl"
              onKeyDown={getHotkeyHandler([
                [
                  "mod+Enter",
                  () => {
                    submitButtonRef.current?.click();
                  },
                ],
              ])}
              {...rest}
            />
            <span className="pointer-events-none absolute bottom-4 right-0 text-xxs font-semibold text-subtle">{`${
              watch("title").length
            }/${POST_TITLE_LENGTH}`}</span>
          </div>
          <div className="min-h-[100px]">
            <input
              type="text"
              className="w-full bg-transparent px-1 focus:outline-none"
              placeholder="Url"
              autoComplete="off"
              {...register("content.url")}
            />
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
