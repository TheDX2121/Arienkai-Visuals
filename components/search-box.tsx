"use client";

import { useState } from "react";

export function SearchBox() {
  const [query, setQuery] = useState("");

  return (
    <form action="/search" className="relative hidden w-full max-w-xs lg:block">
      <input
        name="q"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search users, posts, tags..."
        className="input h-10 rounded-full py-2 pl-10"
      />

      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35">
        ⌕
      </span>
    </form>
  );
}
