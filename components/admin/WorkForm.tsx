"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type WorkData = {
  id?: string;
  title?: string;
  slug?: string;
  client?: string;
  industry?: string;
  summary?: string;
  challenge?: string;
  approach?: string;
  execution?: string;
  results?: string;
  services?: readonly string[];
  coverImage?: string | null;
  gallery?: readonly string[];
  year?: number | null;
  published?: boolean;
};

type UploadedMedia = {
  url: string;
  publicId: string;
  name: string;
  type: "image" | "video";
};

type UploadStatus = {
  name: string;
  progress: number;
  error?: string;
};

type CloudinarySignature = {
  apiKey: string;
  cloudName: string;
  folder: string;
  timestamp: number;
  signature: string;
};

type WorkFormProps = {
  initial?: WorkData;
};

export function WorkForm({ initial }: WorkFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [form, setForm] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    client: initial?.client ?? "",
    industry: initial?.industry ?? "",
    summary: initial?.summary ?? "",
    challenge: initial?.challenge ?? "",
    approach: initial?.approach ?? "",
    execution: initial?.execution ?? "",
    results: initial?.results ?? "",
    services: initial?.services?.join(", ") ?? "",
    coverImage: initial?.coverImage ?? "",
    gallery: initial?.gallery ?? [],
    year: initial?.year ?? "",
    published: initial?.published ?? false,
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [media, setMedia] = useState<UploadedMedia[]>(
    Array.from(
      new Set([
        ...(initial?.coverImage ? [initial.coverImage] : []),
        ...(initial?.gallery ?? []),
      ]),
    ).map((url) => ({
      url,
      publicId: "",
      name: url.split("/").pop() ?? "Existing media",
      type: url.includes("/video/upload/") ? "video" : "image",
    })),
  );
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([]);
  const [error, setError] = useState("");

  function updateField(
    field: keyof typeof form,
    value: string | boolean | readonly string[],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function setUploadProgress(index: number, progress: number, error?: string) {
    setUploadStatuses((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, progress, error } : item,
      ),
    );
  }

  function uploadToCloudinary(
    file: File,
    signature: CloudinarySignature,
    index: number,
    type: "image" | "video",
  ) {
    return new Promise<UploadedMedia>((resolve, reject) => {
      const body = new FormData();
      body.append("file", file);
      body.append("api_key", signature.apiKey);
      body.append("timestamp", String(signature.timestamp));
      body.append("folder", signature.folder);
      body.append("signature", signature.signature);

      const request = new XMLHttpRequest();
      request.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${signature.cloudName}/${type}/upload`,
      );
      request.responseType = "json";
      request.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setUploadProgress(index, Math.round((event.loaded / event.total) * 100));
        }
      };
      request.onload = () => {
        const result = request.response as {
          secure_url?: string;
          public_id?: string;
          error?: { message?: string };
        } | null;

        if (request.status >= 200 && request.status < 300 && result?.secure_url) {
          setUploadProgress(index, 100);
          resolve({
            url: result.secure_url,
            publicId: result.public_id ?? "",
            name: file.name,
            type,
          });
          return;
        }

        const message = result?.error?.message ?? "Cloudinary upload failed";
        setUploadProgress(index, 0, message);
        reject(new Error(message));
      };
      request.onerror = () => {
        const message = "Network error while uploading media";
        setUploadProgress(index, 0, message);
        reject(new Error(message));
      };
      request.send(body);
    });
  }

  async function uploadMedia(files: FileList | null) {
    if (!files?.length) return;

    const selectedFiles = Array.from(files);
    setUploading(true);
    setError("");
    setUploadStatuses(
      selectedFiles.map((file) => ({ name: file.name, progress: 0 })),
    );

    try {
      const signatures = new Map<"image" | "video", CloudinarySignature>();

      async function getSignature(type: "image" | "video") {
        const existing = signatures.get(type);
        if (existing) return existing;

        const response = await fetch("/api/admin/cloudinary/signature", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resourceType: type }),
        });
        const result = (await response.json()) as Partial<CloudinarySignature> & {
          error?: string;
        };

        if (
          !response.ok ||
          !result.apiKey ||
          !result.cloudName ||
          !result.folder ||
          !result.timestamp ||
          !result.signature
        ) {
          throw new Error(result.error ?? "Unable to prepare media upload");
        }

        const signature = result as CloudinarySignature;
        signatures.set(type, signature);
        return signature;
      }

      await Promise.all(
        selectedFiles.map(async (file, index) => {
          const type = file.type.startsWith("video/") ? "video" : "image";
          const maxSize = type === "video" ? 100 : 10;

          if (
            (!file.type.startsWith("image/") && !file.type.startsWith("video/")) ||
            file.size > maxSize * 1024 * 1024
          ) {
            setUploadProgress(
              index,
              0,
              `${type === "video" ? "Videos" : "Images"} must be smaller than ${maxSize} MB.`,
            );
            return;
          }

          try {
            const uploaded = await uploadToCloudinary(
              file,
              await getSignature(type),
              index,
              type,
            );
            setMedia((current) => [...current, uploaded]);
            setForm((current) => ({
              ...current,
              gallery: [...current.gallery, uploaded.url],
              coverImage:
                current.coverImage || (type === "image" ? uploaded.url : ""),
            }));
          } catch {
            // The individual upload status contains the actionable error.
          }
        }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Media upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/admin/work", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: initial?.id,
          title: form.title,
          slug: form.slug,
          client: form.client,
          industry: form.industry,
          summary: form.summary,
          challenge: form.challenge,
          approach: form.approach,
          execution: form.execution,
          results: form.results,
          services: form.services
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          coverImage: form.coverImage,
          year: form.year ? Number(form.year) : null,
          published: form.published,
          gallery: form.gallery,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to save work");
      }

      router.push("/admin/work");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save work",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            className="mt-2 w-full rounded-lg border bg-background px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Slug</label>
          <input
            required
            value={form.slug}
            onChange={(e) => updateField("slug", e.target.value)}
            placeholder="project-name"
            className="mt-2 w-full rounded-lg border bg-background px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Client</label>
          <input
            value={form.client}
            onChange={(e) => updateField("client", e.target.value)}
            className="mt-2 w-full rounded-lg border bg-background px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Industry</label>
          <input
            value={form.industry}
            onChange={(e) =>
              updateField("industry", e.target.value)
            }
            className="mt-2 w-full rounded-lg border bg-background px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Year</label>
          <input
            type="number"
            min={1900}
            max={2100}
            value={form.year}
            onChange={(e) => updateField("year", e.target.value)}
            className="mt-2 w-full rounded-lg border bg-background px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Services
          </label>
          <input
            value={form.services}
            onChange={(e) =>
              updateField("services", e.target.value)
            }
            placeholder="SEO, Branding, Performance"
            className="mt-2 w-full rounded-lg border bg-background px-3 py-2"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Separate services with commas.
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium">Work media</label>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            disabled={uploading}
            onChange={(event) => {
              void uploadMedia(event.target.files);
              event.target.value = "";
            }}
            className="mt-2 block w-full rounded-lg border bg-background px-3 py-2 text-sm"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Upload images and videos. Images can be selected as the cover.
            Images are limited to 10 MB and videos to 100 MB.
          </p>

          {uploading && (
            <div className="mt-3 space-y-2">
              {uploadStatuses.map((status, index) => (
                <div key={`${status.name}-${index}`} className="text-xs">
                  <div className="flex justify-between gap-3">
                    <span className="truncate">{status.name}</span>
                    <span>{status.error ?? `${status.progress}%`}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-[width]"
                      style={{ width: `${status.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {media.length > 0 && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {media.map((item) => (
                <div key={`${item.url}-${item.name}`} className="rounded-lg border p-2">
                  {item.type === "video" ? (
                    <video
                      src={item.url}
                      controls
                      playsInline
                      preload="metadata"
                      className="aspect-video w-full rounded object-cover"
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="aspect-video w-full rounded object-cover"
                    />
                  )}
                  {item.type === "image" && (
                    <label className="mt-2 flex items-center gap-2 text-xs">
                      <input
                        type="radio"
                        name="work-cover-image"
                        checked={form.coverImage === item.url}
                        onChange={() => updateField("coverImage", item.url)}
                      />
                      Use as cover image
                    </label>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium">Summary</label>
          <textarea
            rows={4}
            value={form.summary}
            onChange={(e) =>
              updateField("summary", e.target.value)
            }
            className="mt-2 w-full rounded-lg border bg-background px-3 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium">Challenge</label>
          <textarea
            rows={6}
            value={form.challenge}
            onChange={(e) =>
              updateField("challenge", e.target.value)
            }
            className="mt-2 w-full rounded-lg border bg-background px-3 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium">Approach</label>
          <textarea
            rows={6}
            value={form.approach}
            onChange={(e) =>
              updateField("approach", e.target.value)
            }
            className="mt-2 w-full rounded-lg border bg-background px-3 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium">Execution</label>
          <textarea
            rows={6}
            value={form.execution}
            onChange={(e) =>
              updateField("execution", e.target.value)
            }
            className="mt-2 w-full rounded-lg border bg-background px-3 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium">Results</label>
          <textarea
            rows={6}
            value={form.results}
            onChange={(e) =>
              updateField("results", e.target.value)
            }
            className="mt-2 w-full rounded-lg border bg-background px-3 py-2"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) =>
            updateField("published", e.target.checked)
          }
        />
        Publish immediately
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : isEdit
              ? "Update Work"
              : "Create Work"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/work")}
          className="rounded-lg border px-5 py-2 text-sm font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}