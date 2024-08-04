"use client";

import AuthLink from "@/components/AuthLink";
import { Icons } from "@/components/Icons";
import {
  Settings,
  SettingsContent,
  SettingsGroup,
  SettingsHeader,
  SettingsItem,
} from "@/components/settings/Settings";
import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { DISPLAY_NAME_MAX_LENGTH, USERNAME_MAX_LENGTH } from "@/lib/config";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import {
  getUsernameStatusValidator,
  updateProfileValidator,
} from "@/lib/validators/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebouncedValue } from "@mantine/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface ProfileSettingsProps {
  session: Session | null;
}

const ProfileSettings: FC<ProfileSettingsProps> = ({ session }) => {
  const [showSubmitButton, setShowSubmitButton] = useState(false);

  const form = useForm<z.infer<typeof updateProfileValidator>>({
    resolver: zodResolver(updateProfileValidator),
    defaultValues: {
      name: session?.user.name || "",
      username: session?.user.username || "",
    },
    mode: "all",
  });

  const { update: updateSession } = useSession();
  const router = useRouter();

  const [debouncedUsername] = useDebouncedValue(form.watch("username"), 400);

  const { mutate: updateProfile, isLoading: isUpdateProfileLoading } =
    trpc.settings.updateProfile.useMutation({
      onSuccess: async ({ updatedUser }) => {
        await updateSession();
        form.reset({
          name: updatedUser.name || "",
          username: updatedUser.username || "",
        });
        toast.success("Profile updated Successfully");

        router.refresh();
      },
      onError: (error) => {
        if (error.data?.httpStatus === 401) {
          toast.error("Can't update profile", {
            description: "Login to update profile.",
            action: (
              <AuthLink onClick={() => toast.dismiss()} href="/sign-in">
                Login
              </AuthLink>
            ),
          });
        } else if (error.data?.httpStatus === 409) {
          toast.error("Can't update profile", {
            description: "Username already taken.",
          });
        } else {
          toast.error("Uh oh! Something went wrong.", {
            description: "Please try again later.",
          });
        }
      },
    });

  const {
    data: usernameStatus,
    isSuccess: usernameStatusIsSuccess,
    isFetching: usernameStatusIsFetching,
    refetch: refetchUsernameStatus,
  } = trpc.settings.getUsernameStatus.useQuery(
    {
      username: debouncedUsername || "",
    },
    {
      onSuccess: (data) => {
        if (!data.usernameAvailable) {
          form.setError("username", {
            message: "Username already taken.",
          });
        }
      },
      onError: () => {
        toast.error("Can't check username", {
          description: "Please try again later.",
        });
      },
      onSettled: () => {
        form.clearErrors("username");
      },
      enabled: false,
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (
      debouncedUsername?.toLowerCase() === session?.user.username?.toLowerCase()
    ) {
      return;
    }

    const debouncedTimeout = setTimeout(async () => {
      const { success } = await getUsernameStatusValidator.safeParseAsync({
        username: debouncedUsername,
      });

      if (success) {
        refetchUsernameStatus();
      }
    }, 100);

    return () => clearTimeout(debouncedTimeout);
  }, [debouncedUsername, refetchUsernameStatus, session?.user.username]);

  function onSubmit(values: z.infer<typeof updateProfileValidator>) {
    const dirtyFields: Record<string, boolean> = form.formState.dirtyFields;
    const modifiedValues = Object.fromEntries(
      Object.entries(values).filter(([key]) => dirtyFields[key] || false),
    );

    if (modifiedValues.username) {
      if (usernameStatusIsFetching) {
        return form.setError(
          "username",
          {
            message: "Checking username...",
          },
          { shouldFocus: true },
        );
      }
      if (usernameStatus?.usernameAvailable !== true) {
        return form.setError(
          "username",
          {
            message: "Username already taken.",
          },
          { shouldFocus: true },
        );
      }
    }

    updateProfile(modifiedValues);
  }

  return (
    <Settings className="px-4 md:px-0">
      <SettingsHeader>Customize Profile</SettingsHeader>
      <SettingsContent className="w-full">
        <SettingsGroup groupName="Profile Information">
          <SettingsItem>
            <Form {...form}>
              <form
                id="customizeProfile"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="flex items-center justify-between text-base">
                        Name
                        <span
                          className={cn(
                            "text-xs font-normal text-subtle",
                            form.watch("name")?.length ===
                              DISPLAY_NAME_MAX_LENGTH && "text-destructive",
                          )}
                        >
                          {`${
                            DISPLAY_NAME_MAX_LENGTH -
                            (form.watch("name")?.length || 0)
                          } 
                        Characters Remaining`}
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-emphasis"
                          placeholder="Display Name"
                          maxLength={DISPLAY_NAME_MAX_LENGTH}
                          autoComplete="name"
                          spellCheck="false"
                          onInput={() => {
                            if (
                              Object.entries(form.formState.dirtyFields)
                                .length > 0
                            ) {
                              setShowSubmitButton(true);
                            }
                          }}
                          onBlur={() => {
                            if (
                              Object.entries(form.formState.dirtyFields)
                                .length > 0
                            ) {
                              setShowSubmitButton(true);
                            } else {
                              setShowSubmitButton(false);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="flex items-center justify-between text-base">
                        Username
                        <span
                          className={cn(
                            "text-xs font-normal text-subtle",
                            form.watch("username")?.length ===
                              USERNAME_MAX_LENGTH && "text-destructive",
                          )}
                        >
                          {`${
                            USERNAME_MAX_LENGTH -
                            (form.watch("username")?.length || 0)
                          } 
                        Characters Remaining`}
                        </span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            className="bg-emphasis pr-6"
                            placeholder="Username"
                            maxLength={USERNAME_MAX_LENGTH}
                            autoComplete="off"
                            spellCheck="false"
                            onInput={() => {
                              if (
                                Object.entries(form.formState.dirtyFields)
                                  .length > 0
                              ) {
                                setShowSubmitButton(true);
                              }
                            }}
                            onBlur={() => {
                              if (
                                Object.entries(form.formState.dirtyFields)
                                  .length > 0
                              ) {
                                setShowSubmitButton(true);
                              } else {
                                setShowSubmitButton(false);
                              }
                            }}
                          />
                          <UsernameStatus
                            className="absolute right-1 top-1/2 flex aspect-square h-full -translate-y-1/2 items-center justify-center overflow-hidden"
                            status={{
                              isCheckingStatus: usernameStatusIsFetching,
                              isUsernameAvailable: usernameStatusIsSuccess
                                ? usernameStatus?.usernameAvailable
                                : null,
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <AnimatePresence initial={false}>
                  {showSubmitButton && (
                    <motion.div
                      className="flex items-center gap-2 sm:gap-4"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ ease: "easeInOut", duration: 0.15 }}
                    >
                      <Button
                        variant={"outline"}
                        type="reset"
                        role="cancel"
                        onClick={(event) => {
                          event.preventDefault();
                          form.reset();
                          setShowSubmitButton(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        size={"sm"}
                        form="customizeProfile"
                        role="Update Profile"
                        isLoading={isUpdateProfileLoading}
                      >
                        Update Profile
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </Form>
          </SettingsItem>
        </SettingsGroup>
      </SettingsContent>
    </Settings>
  );
};

const usernameStatusIcons = {
  checking: (
    <Icons.loader
      className="h-4 w-4 animate-spin text-subtle ease-in-out [animation-duration:1.5s]"
      strokeWidth={3}
    />
  ),
  available: <Icons.check className="h-4 w-4 text-green-500" strokeWidth={3} />,
  "not-available": (
    <Icons.close className="h-4 w-4 text-destructive" strokeWidth={3} />
  ),
  null: null,
};

interface UsernameStatusProps extends React.ComponentPropsWithoutRef<"span"> {
  status: {
    isCheckingStatus: boolean;
    isUsernameAvailable: boolean | null;
  };
}

const UsernameStatus: FC<UsernameStatusProps> = React.memo(
  ({ status, ...props }) => {
    const iconVariants = {
      hidden: { opacity: 0, y: -25 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 25 },
    };

    const usernameStatus = status.isCheckingStatus
      ? "checking"
      : status.isUsernameAvailable
        ? "available"
        : status.isUsernameAvailable === false
          ? "not-available"
          : null;

    return (
      <div {...props}>
        <AnimatePresence mode="popLayout" initial={false}>
          {usernameStatus ? (
            <motion.span
              variants={iconVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{
                type: "spring",
                duration: 0.3,
                bounce: 0,
              }}
              key={usernameStatus}
            >
              {usernameStatusIcons[usernameStatus]}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>
    );
  },
);

UsernameStatus.displayName = "UsernameStatus";

export default ProfileSettings;
