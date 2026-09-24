"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type UploadedImage = {
  url: string;
  publicId: string;
  name: string;
};

type UploadStatus = {
  name: string;
  progress: number;
  error?: string;
};

type InsightData = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string | null;
  author?: string;
  categoryId?: string | null;
  readingTime?: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  published?: boolean;
};

type Category = {
  id: string;
  name: string;
};

type InsightFormProps = {
  initial?: InsightData;
  categories: Category[];
};

export function InsightForm({
  initial,
  categories,
}: InsightFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [form, setForm] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    excerpt: initial?.excerpt ?? "",
    content: initial?.content ?? "",
    coverImage: initial?.coverImage ?? "",
    author: initial?.author ?? "Ad Growth Partner",
    categoryId: initial?.categoryId ?? "",
    readingTime: initial?.readingTime ?? 4,
    seoTitle: initial?.seoTitle ?? "",
    seoDescription: initial?.seoDescription ?? "",
    published: initial?.published ?? false,
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>(
    initial?.coverImage
      ? [{ url: initial.coverImage, publicId: "", name: "Current cover" }]
      : [],
  );
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([]);
  const [error, setError] = useState("");

  function updateField(
    field: keyof typeof form,
    value: string | number | boolean,
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
    signature: {
      apiKey: string;
      cloudName: string;
      folder: string;
      timestamp: number;
      signature: string;
    },
    index: number,
  ) {
    return new Promise<UploadedImage>((resolve, reject) => {
      const body = new FormData();
      body.append("file", file);
      body.append("api_key", signature.apiKey);
      body.append("timestamp", String(signature.timestamp));
      body.append("folder", signature.folder);
      body.append("signature", signature.signature);

      const request = new XMLHttpRequest();
      request.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
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
          });
          return;
        }

        const message = result?.error?.message ?? "Cloudinary upload failed";
        setUploadProgress(index, 0, message);
        reject(new Error(message));
      };

      request.onerror = () => {
        const message = "Network error while uploading image";
        setUploadProgress(index, 0, message);
        reject(new Error(message));
      };

      request.send(body);
    });
  }

  async function uploadImages(files: FileList | null) {
    if (!files?.length) return;

    setUploading(true);
    setError("");

    const selectedFiles = Array.from(files);
    setUploadStatuses(
      selectedFiles.map((file) => ({ name: file.name, progress: 0 })),
    );

    try {
      const signatureResponse = await fetch(
        "/api/admin/cloudinary/signature",
        { method: "POST" },
      );
      const signature = (await signatureResponse.json()) as {
        apiKey?: string;
        cloudName?: string;
        folder?: string;
        timestamp?: number;
        signature?: string;
        error?: string;
      };

      if (
        !signatureResponse.ok ||
        !signature.apiKey ||
        !signature.cloudName ||
        !signature.folder ||
        !signature.timestamp ||
        !signature.signature
      ) {
        throw new Error(signature.error ?? "Unable to prepare image upload");
      }

      const validFiles = selectedFiles.filter((file, index) => {
        if (!file.type.startsWith("image/")) {
          setUploadProgress(index, 0, "Only image files can be uploaded.");
          return false;
        }

        if (file.size > 10 * 1024 * 1024) {
          setUploadProgress(index, 0, "Each image must be smaller than 10 MB.");
          return false;
        }

        return true;
      });

      await Promise.all(
        validFiles.map(async (file) => {
          const index = selectedFiles.indexOf(file);

          try {
            const uploaded = await uploadToCloudinary(
              file,
              signature as Required<typeof signature>,
              index,
            );

            setImages((current) => [...current, uploaded]);
            setForm((current) => ({
              ...current,
              coverImage: current.coverImage || uploaded.url,
            }));
          } catch {
            // The individual status contains the actionable error.
          }
        }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/admin/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: initial?.id,
          title: form.title,
          slug: form.slug,
          excerpt: form.excerpt,
          content: form.content,
          coverImage: form.coverImage,
          author: form.author,
          categoryId: form.categoryId || null,
          readingTime: Number(form.readingTime),
          seoTitle: form.seoTitle,
          seoDescription: form.seoDescription,
          published: form.published,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to save insight");
      }

      router.push("/admin/insights");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save insight",
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
            placeholder="my-insight-title"
            className="mt-2 w-full rounded-lg border bg-background px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Author</label>
          <input
            value={form.author}
            onChange={(e) => updateField("author", e.target.value)}
            className="mt-2 w-full rounded-lg border bg-background px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Category</label>
          <select
            value={form.categoryId}
            onChange={(e) => updateField("categoryId", e.target.value)}
            className="mt-2 w-full rounded-lg border bg-background px-3 py-2"
          >
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">
            Reading Time (minutes)
          </label>
          <input
            type="number"
            min={1}
            max={120}
            value={form.readingTime}
            onChange={(e) =>
              updateField("readingTime", Number(e.target.value))
            }
            className="mt-2 w-full rounded-lg border bg-background px-3 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium">Insight images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={uploading}
            onChange={(event) => {
              void uploadImages(event.target.files);
              event.target.value = "";
            }}
            className="mt-2 block w-full rounded-lg border bg-background px-3 py-2 text-sm"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Upload multiple images, then select one as the cover image.
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

          {images.length > 0 && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {images.map((image) => (
                <label
                  key={`${image.url}-${image.name}`}
                  className={`cursor-pointer overflow-hidden rounded-lg border p-2 ${form.coverImage === image.url
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-border"
                    }`}
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="aspect-video w-full rounded object-cover"
                  />
                  <span className="mt-2 flex items-center gap-2 text-xs">
                    <input
                      type="radio"
                      name="cover-image"
                      checked={form.coverImage === image.url}
                      onChange={() => updateField("coverImage", image.url)}
                    />
                    Use as cover image
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium">Excerpt</label>
          <textarea
            rows={3}
            value={form.excerpt}
            onChange={(e) => updateField("excerpt", e.target.value)}
            className="mt-2 w-full rounded-lg border bg-background px-3 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-medium">Content</label>
          <textarea
            required
            rows={14}
            value={form.content}
            onChange={(e) => updateField("content", e.target.value)}
            className="mt-2 w-full rounded-lg border bg-background px-3 py-2 font-mono text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium">SEO Title</label>
          <input
            value={form.seoTitle}
            onChange={(e) =>
              updateField("seoTitle", e.target.value)
            }
            className="mt-2 w-full rounded-lg border bg-background px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            SEO Description
          </label>
          <input
            value={form.seoDescription}
            onChange={(e) =>
              updateField("seoDescription", e.target.value)
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
              ? "Update Insight"
              : "Create Insight"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/insights")}
          className="rounded-lg border px-5 py-2 text-sm font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}