import Link from "next/link";
import { useCallback } from "react";

interface ChannelCardProps {
  title: string;
  description: string;
  href: string;
  username: string;
}

const ChannelCard = ({
  title,
  description,
  href,
  username,
}: ChannelCardProps) => {
  const isDisabled = !username.trim();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (isDisabled) {
        e.preventDefault();
        alert("Please enter and save your username first!");
      }
    },
    [isDisabled]
  );

  if (isDisabled) {
    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: <off>
      <div
        className="p-4 border rounded-lg opacity-50 cursor-not-allowed"
        onClick={() => alert("Please enter and save your username first!")}
        onKeyDown={() => alert("Please enter and save your username first!")}
      >
        <p className="font-medium">{title}</p>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </span>
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="p-4 border rounded-lg transition hover:shadow-md hover:border-primary"
      onClick={handleClick}
    >
      <p className="font-medium">{title}</p>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {description}
      </span>
    </Link>
  );
};

ChannelCard.displayName = "ChannelCard";
export { ChannelCard };
