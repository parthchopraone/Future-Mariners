import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getBunnyStorageCourseRoot, type BunnyNotesCourse } from "@/lib/bunnyStorage";

const storageZoneName = process.env.BUNNY_STORAGE_ZONE_NAME;
const storageAccessKey = process.env.BUNNY_STORAGE_ACCESS_KEY;
const storageApiHost = process.env.BUNNY_STORAGE_API_HOSTNAME ?? "storage.bunnycdn.com";

export async function GET(_: Request, { params }: { params: Promise<{ course: string; path: string[] }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new Response("Sign in required.", { status: 401 });
  if (!storageZoneName || !storageAccessKey) return new Response("Notes storage is not configured.", { status: 503 });

  const { course, path } = await params;
  if (!["imucet", "sponsorship"].includes(course) || !path?.length) return new Response("A valid course and file path are required.", { status: 400 });

  const root = getBunnyStorageCourseRoot(course as BunnyNotesCourse);
  const filePath = `${root}/${path.join("/")}`;
  const response = await fetch(`https://${storageApiHost}/${encodeURIComponent(storageZoneName)}/${filePath.split("/").map(encodeURIComponent).join("/")}`, {
    headers: { AccessKey: storageAccessKey },
  });
  if (!response.ok) return new Response("The requested note could not be found.", { status: response.status === 404 ? 404 : 502 });

  return new Response(response.body, {
    headers: {
      "Cache-Control": "private, max-age=300",
      "Content-Disposition": `inline; filename="${path.at(-1)?.replaceAll('"', "") ?? "note.pdf"}"`,
      "Content-Type": response.headers.get("content-type") ?? "application/pdf",
    },
  });
}
