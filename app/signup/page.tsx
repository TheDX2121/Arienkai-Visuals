import Link from "next/link";

type SignupPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

function getErrorMessage(error?: string) {
  if (error === "email-already-used") {
    return "This email is already registered. Please login or use another email.";
  }

  if (error === "username-already-used") {
    return "This username is already taken. Please choose another username.";
  }

  if (error === "invalid-fields") {
    return "Please check your details. Password must be at least 8 characters.";
  }

  if (error === "server-error") {
    return "Signup failed because the server/database is not ready. Check Supabase User table and Vercel DATABASE_URL.";
  }

  return "";
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const errorMessage = getErrorMessage(params.error);

  return (
    <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div>
        <div className="pill mb-5 w-fit">Start free</div>

        <h1 className="text-5xl font-black tracking-tight">
          Create, learn, sell, and grow.
        </h1>

        <p className="mt-4 max-w-xl text-white/58">
          Join Arienkai Visuals as an editor, designer, anime artist, or student.
        </p>
      </div>

      <form action="/api/auth/signup" method="post" className="glass-panel rounded-[2rem] p-6">
        {errorMessage ? (
          <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
            {errorMessage}
          </div>
        ) : null}

        <label className="mb-2 block text-sm font-bold">
          Display name
        </label>
        <input className="input" name="displayName" placeholder="Arienkai Admin" required />

        <label className="mb-2 mt-5 block text-sm font-bold">
          Username
        </label>
        <input className="input" name="username" placeholder="admin" required />

        <label className="mb-2 mt-5 block text-sm font-bold">
          Email
        </label>
        <input className="input" name="email" type="email" placeholder="you@example.com" required />

        <label className="mb-2 mt-5 block text-sm font-bold">
          Password
        </label>
        <input className="input" name="password" type="password" placeholder="Minimum 8 characters" required />

        <button className="primary-button mt-6 w-full" type="submit">
          Create account
        </button>

        <div className="mt-5 text-center text-sm text-white/50">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-white">
            Sign in
          </Link>
        </div>
      </form>
    </section>
  );
}
