"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const ChatHeader: React.FC = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("username")?.trim();
    if (typeof window !== "undefined" && window.localStorage && stored) {
      setUsername(stored);
    }
  }, []);
  return (
    <div className="p-4 border-b flex justify-between">
      <div>
        <h1 className="font-semibold">Message App</h1>
        <p className="text-xs text-foreground/80">
          Built by Nextjs + TailwindCSS
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Image
          className="dark:invert border rounded"
          src="/avatar.svg"
          alt="User Avatar"
          width={16}
          height={16}
          priority
        />

        <p className="font-bold text-foreground" suppressHydrationWarning>
          {username}
        </p>
      </div>
    </div>
  );
};

export { ChatHeader };
