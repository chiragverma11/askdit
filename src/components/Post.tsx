import { cn } from "@/lib/utils";

interface PostProps extends React.HTMLAttributes<HTMLDivElement> {}

const Post = ({ className, ...props }: PostProps) => {
  return (
    <div
      className={cn(
        "mx-auto h-[40vh] rounded-3xl border border-default/25 bg-emphasis  hover:border-default/60 lg:h-[65vh]",
        className,
      )}
      {...props}
    >
      <div className="px-6 py-8">
        <p className="text-xl font-semibold">This is a Post!</p>
      </div>
    </div>
  );
};

export default Post;
