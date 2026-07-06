"use client";

import type { ReactNode } from "react";

type UserPlanBadgeProps = {
  subscription?: string | null;
  size?: "sm" | "md" | "lg";
};

type NameWithBadgeProps = {
  children: ReactNode;
  subscription?: string | null;
  className?: string;
};

function badgeInfo(subscription?: string | null) {
  if (subscription === "STUDIO") {
    return {
      src: "/badges/studio-badge.png",
      alt: "Studio plan"
    };
  }

  if (subscription === "CREATOR") {
    return {
      src: "/badges/creator-badge.png",
      alt: "Creator plan"
    };
  }

  return null;
}

function sizeClass(size: "sm" | "md" | "lg") {
  if (size === "lg") return "h-6 w-6";
  if (size === "md") return "h-5 w-5";
  return "h-4 w-4";
}

export function UserPlanBadge({ subscription, size = "md" }: UserPlanBadgeProps) {
  const badge = badgeInfo(subscription);

  if (!badge) return null;

  return (
    <img
      src={badge.src}
      alt={badge.alt}
      title={badge.alt}
      className={`${sizeClass(size)} inline-block rounded-full object-contain align-middle`}
    />
  );
}

export function NameWithBadge({
  children,
  subscription,
  className = ""
}: NameWithBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span>{children}</span>
      <UserPlanBadge subscription={subscription} />
    </span>
  );
}
