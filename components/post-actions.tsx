"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type PostActionsProps = {
  postId: string;
  isLoggedIn: boolean;
  liked: boolean;
  saved: boolean;
  likeCount: number;
  saveCount: number;
  commentCount: number;
};

export function PostActions({
  postId,
  isLoggedIn,
  liked,
  saved,
  likeCount,
  saveCount,
  commentCount
}: PostActionsProps) {
  const router = useRouter();
  const [isBusy, setIsBusy] = useState(false);
  const [comment, setComment] = useState("");

  async function sendAction(url: string, body?: BodyInit) {
    if (!isLoggedIn) {
      router.push(`/login?next=/post/${postId}`);
      return;
    }

    setIsBusy(true);

    await fetch(url, {
      method: "POST",
      body
    });

    setIsBusy(false);
    router.refresh();
  }

  async function submitComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!comment.trim()) return;

    const formData = new FormData();
    formData.set("body", comment.trim());

    await sendAction(`/api/posts/${postId}/comments`, formData);
    setComment("");
  }

  return (
    <div className="mt-7">
      <div className="grid grid-cols-3 gap-3 text-center text-sm">
        <button
          type="button"
          disabled={isBusy}
          onClick={() => sendAction(`/api/posts/${postId}/like`)}
          className="rounded-2xl bg-white/8 p-4 transition hover:bg-white/12"
        >
          {liked ? "♥" : "♡"}
          <br />
          {likeCount}
        </button>

        <button
          type="button"
          className="rounded-2xl bg-white/8 p-4"
        >
          💬
          <br />
          {commentCount}
        </button>

        <button
          type="button"
          disabled={isBusy}
          onClick={() => sendAction(`/api/posts/${postId}/save`)}
          className="rounded-2xl bg-white/8 p-4 transition hover:bg-white/12"
        >
          {saved ? "🔖" : "📑"}
          <br />
          {saveCount}
        </button>
      </div>

      <form onSubmit={submitComment} className="mt-5 grid gap-3">
        <textarea
          className="input min-h-24"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Write a comment..."
        />

        <button className="primary-button w-fit" type="submit" disabled={isBusy}>
          Comment
        </button>
      </form>
    </div>
  );
}
