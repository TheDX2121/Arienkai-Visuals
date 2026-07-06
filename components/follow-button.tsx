"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type FollowButtonProps = {
  username: string;
  isLoggedIn: boolean;
  isFollowing: boolean;
};

export function FollowButton({
  username,
  isLoggedIn,
  isFollowing
}: FollowButtonProps) {
  const router = useRouter();
  const [isBusy, setIsBusy] = useState(false);

  async function toggleFollow() {
    if (!isLoggedIn) {
      router.push(`/login?next=/profile/${username}`);
      return;
    }

    setIsBusy(true);

    await fetch(`/api/users/${username}/follow`, {
      method: "POST"
    });

    setIsBusy(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={toggleFollow}
      disabled={isBusy}
      className={isFollowing ? "secondary-button" : "primary-button"}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}
