interface ReactionPillProps {
  emoji: string;
  count: number;
  onClick: () => void;
  active?: boolean;
}
const ReactionPill = ({ emoji, count, onClick, active }: ReactionPillProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm border
        hover:bg-foreground/80
       ${active ? "border-2 border-primary bg-foreground" : "bg-foreground"}`}
  >
    <span>{emoji}</span>
    {count > 0 && <span className="text-xs text-slate-600">{count}</span>}
  </button>
);

ReactionPill.displayName = "ReactionPill";
export default ReactionPill;
