import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-3xl place-items-center px-4 text-center">
      <div>
        <div className="text-8xl font-black text-brand">404</div>
        <h1 className="mt-4 text-4xl font-black">This visual is missing.</h1>
        <p className="mt-3 text-white/55">The page may have been deleted, private, or moved.</p>
        <Link href="/" className="primary-button mt-8">Back home</Link>
      </div>
    </section>
  );
}
