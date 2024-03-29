import { POST_TITLE_LENGTH } from "@/lib/config";
import { cn } from "@/lib/utils";
import { getHotkeyHandler } from "@mantine/hooks";
import { FC, useEffect, useRef } from "react";
import { RefCallBack, UseFormRegisterReturn } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";

interface SubmitPostTitleProps
  extends React.ComponentPropsWithoutRef<typeof TextareaAutosize> {
  titleLength: number;
  titleValidationRef: RefCallBack;
  useFormRegisterRest: Omit<UseFormRegisterReturn, "ref">;
  _titleRef?: React.MutableRefObject<HTMLTextAreaElement | null>;
  submitButtonRef?: React.MutableRefObject<HTMLButtonElement | null>;
}

const SubmitPostTitle: FC<SubmitPostTitleProps> = ({
  titleLength,
  titleValidationRef,
  useFormRegisterRest,
  _titleRef,
  submitButtonRef,
  className,
  ...props
}) => {
  const titleFocusRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (titleFocusRef.current) {
      titleFocusRef.current.focus();
    }
  }, []);

  return (
    <div className="relative">
      <TextareaAutosize
        maxLength={POST_TITLE_LENGTH}
        ref={(e) => {
          titleFocusRef.current = e; // For focusing
          titleValidationRef(e); // For form validation
          if (_titleRef) _titleRef.current = e; // Passed from parent if needed
        }}
        placeholder="Title"
        className={cn(
          "w-full resize-none overflow-hidden bg-transparent pr-12 text-2xl font-bold focus:outline-none lg:pr-10 lg:text-4xl",
          className,
        )}
        onKeyDown={getHotkeyHandler([
          [
            "mod+Enter",
            () => {
              submitButtonRef?.current?.click();
            },
          ],
        ])}
        {...props}
        {...useFormRegisterRest} // For form validation
      />
      <span className="pointer-events-none absolute bottom-4 right-0 text-xxs font-semibold text-subtle">{`${titleLength}/${POST_TITLE_LENGTH}`}</span>
    </div>
  );
};

export default SubmitPostTitle;
