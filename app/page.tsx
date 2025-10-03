"use client";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChannelCard } from "@/components/channelCard";

const STORAGE_KEY = "username";

export default function Home() {
  const [username, setUsername] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem(STORAGE_KEY)?.trim() || "";
    if (stored) {
      setUsername(stored);
    }
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <off>
  const storedUsername = useMemo(() => {
    if (!isClient) return "";
    return localStorage.getItem(STORAGE_KEY)?.trim() || "";
  }, [isClient, username]);

  const hasChanges = useMemo(
    () => username.trim() !== storedUsername,
    [username, storedUsername]
  );

  const isUsernameValid = useMemo(() => username.trim().length > 0, [username]);

  const handleSaveUsername = useCallback(() => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      alert("Please enter a username first!");
      return;
    }

    const isUpdate = !!storedUsername;
    localStorage.setItem(STORAGE_KEY, trimmedUsername);

    alert(
      isUpdate
        ? "Username updated successfully!"
        : "Username saved successfully!"
    );

    setUsername(trimmedUsername);
  }, [username, storedUsername]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && hasChanges && isUsernameValid) {
        handleSaveUsername();
      }
    },
    [hasChanges, isUsernameValid, handleSaveUsername]
  );

  if (!isClient) {
    return null;
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-lg">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Welcome to Message App</h1>
          <p className="text-gray-600 dark:text-gray-400">
            To get started, please add your username and select a channel to
            join the chat.
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-2">
            <input
              className="flex-1 border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="username"
            />
            <button
              type="button"
              onClick={handleSaveUsername}
              className="px-4 py-2 bg-primary text-foreground rounded-md hover:opacity-80 
                disabled:cursor-not-allowed disabled:opacity-50 transition-opacity"
              disabled={!hasChanges || !isUsernameValid}
            >
              Save
            </button>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            * Your username will be saved in local storage
          </span>
        </div>

        {/* Channels List */}
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-2">Available Channels</h3>
          <div className="flex flex-col gap-3">
            <ChannelCard
              title="General Channel"
              description="Chat with everyone in the community"
              href="/chat/general"
              username={username}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Separated component for better reusability
