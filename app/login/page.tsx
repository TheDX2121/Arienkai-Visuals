import Link from "next/link";

export default function LoginPage() {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div>
        <div className="pill mb-5 w-fit">Welcome back</div>
        <h1 className="text-5xl font-black tracking-tight">Enter your creator studio.</h1>
        <p className="mt-4 max-w-xl text-white/58">Sign in to follow artists, save GFX packs, rate previews, continue courses, and upload your latest anime artwork.</p>
      </div>
      <form action="/api/auth/login" method="post" className="glass-panel rounded-[2rem] p-6">
        <label className="mb-2 block text-sm font-bold">Email or username</label>
        <input className="input" name="identifier" placeholder="rin@arienkai.visuals" />
        <label className="mb-2 mt-5 block text-sm font-bold">Password</label>
        <input className="input" name="password" type="password" placeholder="••••••••" />
        <button className="primary-button mt-6 w-full" type="submit">Sign in</button>
        <div className="mt-5 text-center text-sm text-white/50">New here? <Link href="/signup" className="font-bold text-white">Create an account</Link></div>
      </form>
    </section>
  );
}
