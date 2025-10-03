"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");

  const handleAddUsername = () => {
    //TODO: register account by username - check conflict username
    if (username.trim()) {
      localStorage.setItem("username", username.trim());
      setUsername(username.trim());
      alert(
        localStorage.getItem("username")?.trim()
          ? "Update username successfully!"
          : "Add username successfully"
      );
    } else {
      alert("Please enter a username first!");
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("username")?.trim();
    if (stored) {
      setUsername(stored);
    }
  }, []);

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

        <h1 className="text-2xl font-bold">Welcome to Message App</h1>
        <p className="text-gray-600">
          To get started, please add your username and select a channel to join
          the chat.
        </p>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-2">
            <input
              className="flex-1 border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAddUsername}
              className="px-4 py-2 bg-primary text-foreground rounded-md hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={
                typeof window !== "undefined" &&
                window.localStorage &&
                localStorage.getItem("username")?.trim() === username
              }
              suppressHydrationWarning
            >
              {typeof window !== "undefined" &&
              window.localStorage &&
              localStorage.getItem("username")?.trim() === undefined
                ? "Add"
                : "Change"}
            </button>
          </div>
          <span className="text-sm text-gray-500">
            * The username will be saved in your local storage
          </span>
        </div>

        <div className="w-full">
          <h3 className="text-lg font-semibold mb-2">Available Channels</h3>
          <div className="flex flex-col gap-3">
            <a
              className={`p-4 border rounded-lg transition ${
                username
                  ? "hover:shadow-md hover:border-primary cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              }`}
              href={username ? "/chat/general" : "#"}
              onClick={(e) => {
                if (!username) {
                  e.preventDefault();
                  alert("Please enter and save your username first!");
                }
              }}
            >
              <p className="font-medium">General Channel</p>
              <span className="text-sm text-forground/80">
                Chat with everyone in the community
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
