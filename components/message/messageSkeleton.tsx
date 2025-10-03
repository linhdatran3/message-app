const MessageItemSkeleton = ({ fromMe = false }: { fromMe?: boolean }) => {
  return (
    <div className={`flex gap-3 ${fromMe ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`flex flex-col gap-2 max-w-[70%] ${
          fromMe ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`rounded-2xl p-4 space-y-2 ${
            fromMe
              ? "bg-slate-200 dark:bg-slate-700 rounded-tr-sm"
              : "bg-slate-100 dark:bg-slate-800 rounded-tl-sm"
          }`}
        >
          <div className="w-48 h-4 bg-slate-300 dark:bg-slate-600 rounded animate-pulse" />
          <div className="w-36 h-4 bg-slate-300 dark:bg-slate-600 rounded animate-pulse" />
          <div className="w-44 h-4 bg-slate-300 dark:bg-slate-600 rounded animate-pulse" />
        </div>

        <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
      </div>
    </div>
  );
};

const MessagesSkeleton = () => {
  return (
    <div className="space-y-6 p-4">
      <MessageItemSkeleton fromMe={false} />
      <MessageItemSkeleton fromMe={true} />
      <MessageItemSkeleton fromMe={false} />
      <MessageItemSkeleton fromMe={false} />
      <MessageItemSkeleton fromMe={true} />
    </div>
  );
};

MessagesSkeleton.displayName = "MessagesSkeleton";
export { MessagesSkeleton };
