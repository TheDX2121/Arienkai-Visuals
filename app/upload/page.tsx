import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { CloudinaryUploadField } from "@/components/cloudinary-upload-field";

type UploadPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

function getErrorMessage(error?: string) {
  if (error === "missing-fields") {
    return "Title, description, tag, hashtag, and file are required.";
  }

  if (error === "not-logged-in") {
    return "Please login before uploading.";
  }

  return "";
}

export default async function UploadPage({ searchParams }: UploadPageProps) {
  const user = await currentUser();
  const params = await searchParams;

  if (!user) {
    redirect("/login?next=/upload");
  }

  const errorMessage = getErrorMessage(params.error);

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="pill mb-4 w-fit">Upload post</div>

        <h1 className="text-4xl font-black">
          Share your artwork, edit, thumbnail, or GFX preview.
        </h1>

        <p className="mt-3 text-white/55">
          Required: title, description, tag, hashtag, and file. Anime tag is optional.
        </p>
      </div>

      {params.success ? (
        <div className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-100">
          Post uploaded successfully. Check Explore.
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
          {errorMessage}
        </div>
      ) : null}

      <form
        action="/api/posts"
        method="post"
        className="glass-panel rounded-[2rem] p-6"
      >
        <label className="mb-2 block text-sm font-bold">
          Title <span className="text-red-300">*</span>
        </label>

        <input
          className="input"
          name="title"
          placeholder="Akuma City Color Grade"
          required
        />

        <label className="mb-2 mt-5 block text-sm font-bold">
          Description <span className="text-red-300">*</span>
        </label>

        <textarea
          className="input min-h-32"
          name="description"
          placeholder="Write what this post is about..."
          required
        />

        <label className="mb-2 mt-5 block text-sm font-bold">
          Tag <span className="text-red-300">*</span>
        </label>

        <select className="input" name="tag" defaultValue="" required>
          <option value="" disabled>
            Select tag
          </option>
          <option value="Artwork">Artwork</option>
          <option value="Thumbnail">Thumbnail</option>
          <option value="Video Edit">Video Edit</option>
          <option value="GFX">GFX</option>
          <option value="UI/UX">UI/UX</option>
          <option value="Motion Graphics">Motion Graphics</option>
          <option value="Other">Other</option>
        </select>

        <label className="mb-2 mt-5 block text-sm font-bold">
          Hashtag <span className="text-red-300">*</span>
        </label>

        <input
          className="input"
          name="hashtag"
          placeholder="animeedit"
          required
        />

        <p className="mt-2 text-xs text-white/40">
          Write without #. Example: animeedit, thumbnaildesign, gfxpack
        </p>

        <label className="mb-2 mt-5 block text-sm font-bold">
          Anime tag optional
        </label>

        <input
          className="input"
          name="animeTag"
          placeholder="Demon Slayer, Jujutsu Kaisen, Naruto..."
        />

        <CloudinaryUploadField
          name="fileUrl"
          label="Drop file / Upload file *"
          resourceType="auto"
          buttonText="Upload file"
          placeholder="Upload image/video or paste media URL"
          allowedFormats={["jpg", "jpeg", "png", "webp", "mp4", "mov", "webm"]}
          maxFileSizeBytes={500000000}
        />

        <button className="primary-button mt-6 w-full justify-center" type="submit">
          Publish to Explore
        </button>
      </form>
    </section>
  );
}
