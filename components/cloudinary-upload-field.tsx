"use client";

import { useEffect, useState } from "react";

type ResourceType = "image" | "video";

type CloudinaryUploadFieldProps = {
  name: string;
  label: string;
  defaultValue?: string | null;
  resourceType: ResourceType;
  buttonText: string;
  placeholder: string;
};

type CloudinaryWidgetResult = {
  event?: string;
  info?: {
    secure_url?: string;
  };
};

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (error: unknown, result: CloudinaryWidgetResult) => void
      ) => {
        open: () => void;
      };
    };
  }
}

export function CloudinaryUploadField({
  name,
  label,
  defaultValue,
  resourceType,
  buttonText,
  placeholder
}: CloudinaryUploadFieldProps) {
  const [value, setValue] = useState(defaultValue || "");
  const [isReady, setIsReady] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (window.cloudinary) {
      setIsReady(true);
      return;
    }

    const existingScript = document.getElementById("cloudinary-upload-widget");

    if (existingScript) {
      existingScript.addEventListener("load", () => setIsReady(true));
      return;
    }

    const script = document.createElement("script");
    script.id = "cloudinary-upload-widget";
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;
    script.onload = () => setIsReady(true);

    document.body.appendChild(script);
  }, []);

  function openUploadWidget() {
    setMessage("");

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setMessage("Cloudinary env variables are missing in Vercel.");
      return;
    }

    if (!window.cloudinary) {
      setMessage("Cloudinary upload widget is still loading. Try again.");
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        resourceType,
        multiple: false,
        sources: ["local", "url"],
        clientAllowedFormats:
          resourceType === "image"
            ? ["jpg", "jpeg", "png", "webp"]
            : ["mp4", "mov", "webm"],
        maxFileSize: resourceType === "image" ? 10000000 : 500000000
      },
      (error, result) => {
        if (error) {
          setMessage("Upload failed. Try again.");
          return;
        }

        if (result.event === "success" && result.info?.secure_url) {
          setValue(result.info.secure_url);
          setMessage("Upload complete. URL added.");
        }
      }
    );

    widget.open();
  }

  return (
    <div>
      <label className="mb-2 mt-5 block text-sm font-bold">
        {label}
      </label>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          className="input"
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
        />

        <button
          className="secondary-button justify-center"
          type="button"
          onClick={openUploadWidget}
          disabled={!isReady}
        >
          {isReady ? buttonText : "Loading..."}
        </button>
      </div>

      <p className="mt-2 text-xs text-white/40">
        Paste a URL manually or upload directly to Cloudinary.
      </p>

      {message ? (
        <p className="mt-2 text-xs text-white/60">
          {message}
        </p>
      ) : null}

      {value ? (
        <p className="mt-2 break-all text-xs text-white/30">
          {value}
        </p>
      ) : null}
    </div>
  );
}
