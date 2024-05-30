"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { COMMUNITY_NAME_REGEX } from "@/lib/config";
import { trpc } from "@/lib/trpc";
import { useRouter } from "next/navigation";
import AuthLink from "./AuthLink";
import { Icons } from "./Icons";
import { toast } from "sonner";

const createCommunityFormSchema = z.object({
  communityName: z.string().regex(COMMUNITY_NAME_REGEX, {
    message:
      "Community names must be between 3-21 characters, and can only contain letters, numbers, or underscores.",
  }),
});

interface CreateCommunityFormProps {}

const CreateCommunityForm: FC<CreateCommunityFormProps> = ({}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof createCommunityFormSchema>>({
    resolver: zodResolver(createCommunityFormSchema),
    defaultValues: {
      communityName: "",
    },
    mode: "all",
  });

  const { mutate: createCommunity, isLoading } =
    trpc.community.createCommunity.useMutation({
      onSuccess: (data) => {
        toast.success("Community created Successfully");
        router.push(`/r/${data}`);
      },
      onError: (error) => {
        if (error.data?.httpStatus === 401) {
          toast.error("Can't create community", {
            description: "Login to create community.",
            action: (
              <AuthLink href="/sign-in" onClick={() => toast.dismiss()}>
                Login
              </AuthLink>
            ),
          });
        } else if (error.data?.httpStatus === 409) {
          toast.error("Can't create community.", {
            description: `Sorry, community r/${form.getValues(
              "communityName",
            )} already exists.`,
          });
        } else {
          toast.error("Uh oh! Something went wrong.", {
            description: "Please try again later.",
          });
        }
      },
    });

  function onSubmit(values: z.infer<typeof createCommunityFormSchema>) {
    createCommunity(values);
  }

  return (
    <Form {...form}>
      <form
        id="createCommunity"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="communityName"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-base">Name</FormLabel>
              <FormDescription className="text-sm">
                Community names including capitalization cannot be changed.
                <TooltipProvider skipDelayDuration={500}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icons.info className="ml-2 inline h-4 w-4 text-inherit" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      alignOffset={25}
                      sideOffset={5}
                      className="hidden border-none px-2 py-1 text-xs lg:block"
                    >
                      <p className="w-48 px-2 py-1 text-center font-medium">
                        {`
                        Names cannot have spaces (e.g., "r/bookclub" not "r/book
                        club"), must be between 3-21 characters, and underscores
                        ("_") are the only special characters allowed. Avoid
                        using solely trademarked names (e.g., "r/FansOfAcme" not
                        "r/Acme")`}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormDescription>
              <FormControl>
                <div>
                  <div className="relative mb-2 mt-6 flex items-center">
                    <p className="absolute left-4 text-default/75">r/</p>
                    <Input
                      {...field}
                      className="bg-subtle pl-7 focus-visible:bg-default"
                      autoComplete="off"
                      spellCheck="false"
                    />
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant={"outline"}
            type="reset"
            role="cancel"
            onClick={(event) => {
              event.preventDefault();
              router.back();
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size={"sm"}
            form="createCommunity"
            role="Create Community"
            isLoading={isLoading}
          >
            Create Community
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateCommunityForm;
