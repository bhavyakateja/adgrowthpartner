import { requireAdmin } from "@/lib/auth";
import {
  createCloudinarySignature,
  getCloudinaryConfig,
} from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json().catch(() => ({}));
    const resourceType = body.resourceType === "video" ? "video" : "image";

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = `ad-growth-partner/${resourceType}s`;
    const signature = createCloudinarySignature({ folder, timestamp });
    const { apiKey, cloudName } = getCloudinaryConfig();

    return Response.json({
      cloudName,
      apiKey,
      folder,
      timestamp,
      signature,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    return Response.json(
      { success: false, error: "Cloudinary is not configured correctly." },
      { status: 503 },
    );
  }
}