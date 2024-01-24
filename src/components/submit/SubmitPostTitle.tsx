import { POST_TITLE_LENGTH } from "@/lib/config";
import { FC } from "react";
import { RefCallBack, UseFormRegisterReturn } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";

interface SubmitPostTitleProps
  extends React.HTMLAttributes<HTMLTextAreaElement> {
  titleLength: number;
  titleRef: RefCallBack;
  rest: Omit<UseFormRegisterReturn, "ref">;
  _titleRef?: React.MutableRefObject<HTMLTextAreaElement | null>;
}

const SubmitPostTitle: FC<SubmitPostTitleProps> = ({
  titleLength,
  titleRef,
  rest,
  _titleRef,
  onKeyDown,
}) => {
  return (
    <>
      <TextareaAutosize
        maxLength={POST_TITLE_LENGTH}
        ref={(e) => {
          titleRef(e);
          if (_titleRef) _titleRef.current = e;
        }}
        placeholder="Title"
        className="w-full resize-none overflow-hidden bg-transparent pr-12 text-2xl font-bold focus:outline-none lg:pr-10 lg:text-4xl"
        onKeyDown={onKeyDown}
        {...rest}
      />
      <span className="pointer-events-none absolute bottom-4 right-0 text-xxs font-semibold text-subtle">{`${titleLength}/${POST_TITLE_LENGTH}`}</span>
    </>
  );
};

export default SubmitPostTitle;
