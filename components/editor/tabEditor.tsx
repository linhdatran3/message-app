type TabEditor = "preview" | "write";

const TabList = ({
  actived,
  setActived,
}: {
  actived: TabEditor;
  setActived: (actived: TabEditor) => void;
}) => {
  const tabs: TabEditor[] = ["write", "preview"];

  return (
    <div
      role="tablist"
      className="flex relative after:content-[''] after:absolute after:w-full after:h-[1px] after:bottom-0 z-1 after:bg-white"
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => setActived(tab)}
          className={`py-2 px-4 relative z-10 ${
            actived === tab
              ? "bg-background border border-b-0 border-t-0 rounded-t-lg transition-transform ease-linear duration-100"
              : "bg-foreground/10 border-b border-t-0"
          } ${actived === "write" && "md:border-l-0 "}`}
        >
          {tab.toLocaleUpperCase()}
        </button>
      ))}
    </div>
  );
};

TabList.displayName = "TabList";
export { TabList, type TabEditor };
