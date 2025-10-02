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
    <div role="tablist" className="flex">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => setActived(tab)}
          className={`py-2 px-4 ${
            actived === tab
              ? "bg-background border border-b-0 rounded-t-lg transition-transform ease-linear duration-100"
              : "bg-foreground/20 border-b"
          }`}
        >
          {tab.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

TabList.displayName = "TabList";
export { TabList, type TabEditor };
