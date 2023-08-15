"use client";

import { FC } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

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
import { Axis3dIcon, Info } from "lucide-react";
import { useRouter } from "next/navigation";

const communityNameRegex = /^[a-zA-Z0-9_]{3,21}$/;

const createCommunityFormSchema = z.object({
  communityName: z.string().regex(communityNameRegex, {
    message:
      "Community names must be between 3–21 characters, and can only contain letters, numbers, or underscores.",
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

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async (payload: { communityName: string }) => {
      const { data } = await axios.post("/api/subreddit", payload);
      return data as string;
    },
    onSuccess: (data) => {
      router.push(`/r/${data}`);
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
                      <Info className="ml-2 inline h-4 w-4 text-inherit" />
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
                  <Input
                    {...field}
                    className="mb-2 mt-6 bg-subtle pl-6 focus-visible:bg-default"
                    autoComplete="off"
                  />
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
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size={"sm"}
            form="createCommunity"
            role="Create Community"
          >
            Create Community
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateCommunityForm;
