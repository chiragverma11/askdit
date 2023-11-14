import { toast } from "@/hooks/use-toast";
import { trpc } from "@/lib/trpc";
import { addProtocol } from "@/lib/utils";
import { PostLinkValidator } from "@/lib/validators/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { getHotkeyHandler, useDebouncedValue } from "@mantine/hooks";
import { PostType } from "@prisma/client";
import { DotWave } from "@uiball/loaders";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SubmitPostTitle from "./SubmitPostTitle";
import { Button } from "./ui/Button";

interface CreateLinkPostProps extends React.HTMLAttributes<HTMLDivElement> {
  communityId: string;
}

type FormData = z.infer<typeof PostLinkValidator>;

const CreateLinkPost: FC<CreateLinkPostProps> = ({
  communityId,
  className,
}) => {
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

  const {
    data: metadata,
    refetch,
    isFetching: isFetchingMetadata,
    isSuccess,
  } = trpc.post.getUrlMetadata.useQuery(
    { url: addProtocol(debouncedUrl) },
    { enabled: false, retry: false, retryOnMount: false },
  );

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
    data.content.url = addProtocol(data.content.url);

    const payload = {
      title: data.title,
      content: data.content,
      communityId,
      type: postType,
    };

    createPost(payload);
  };

  useEffect(() => {
    setTimeout(async () => {
      const result = await trigger("content.url");
      if (result) {
        refetch();
      }
    }, 100);
  }, [debouncedUrl, refetch, trigger]);

  useEffect(() => {
    if (metadata?.success === 1) {
      console.log("useEffect");
      const newUrl = new URL(metadata.meta.url);

      const hostName = newUrl.hostname.replace("www.", "");

      setValue("content.domain", hostName);

      if (metadata.meta.image.url) {
        setValue("content.ogImage", metadata.meta.image.url);
      }

      if (!dirtyFields.title) {
        if (metadata.meta.title) {
          setValue("title", metadata.meta.title as string);
        }
      }
    }
  }, [metadata, dirtyFields.title, setValue, isSuccess]);

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
                className="w-full bg-transparent pr-6 focus:outline-none"
                placeholder="Enter your URL"
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
              Title will be automatically fetched.
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
