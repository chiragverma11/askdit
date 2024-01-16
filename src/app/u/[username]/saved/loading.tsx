import PostSkeleton from "@/components/PostSkeleton";

export default function Loading() {
  return (
    <ul className="space-y-1 pb-16 md:space-y-2 lg:pb-0">
      {Array.from({ length: 4 }).map((_, index) => (
        <li key={index}>
          <PostSkeleton variant="compact" />
        </li>
      ))}
    </ul>
  );
}
