const storageZoneName = process.env.BUNNY_STORAGE_ZONE_NAME;
const storageAccessKey = process.env.BUNNY_STORAGE_ACCESS_KEY;
const storageApiHost = process.env.BUNNY_STORAGE_API_HOSTNAME ?? "storage.bunnycdn.com";
const storageCdnHost = process.env.BUNNY_STORAGE_CDN_HOSTNAME;

export type BunnyStorageFile = {
  path: string;
  name: string;
  size: number;
  updatedAt: string;
  url: string | null;
};

type BunnyStorageEntry = {
  ObjectName: string;
  IsDirectory: boolean;
  Length: number;
  LastChanged: string;
};

const isConfigured = () => Boolean(storageZoneName && storageAccessKey);

const encodePath = (path: string) => path.split("/").filter(Boolean).map(encodeURIComponent).join("/");

const getFileUrl = (course: BunnyNotesCourse, path: string) => {
  if (storageCdnHost) return `https://${storageCdnHost.replace(/\/$/, "")}/${encodePath(path)}`;
  return `/api/notes/${course}/${path.split("/").filter(Boolean).map(encodeURIComponent).join("/")}`;
};

export type BunnyNotesCourse = "imucet" | "sponsorship";

const courseRoots: Record<BunnyNotesCourse, string> = {
  imucet: "IMUCET",
  sponsorship: "SPONSORSHIP",
};

const listDirectory = async (course: BunnyNotesCourse, path: string): Promise<BunnyStorageFile[]> => {
  if (!storageZoneName || !storageAccessKey) return [];

  const normalizedPath = path.replace(/^\/|\/$/g, "");
  const queryPath = encodePath(normalizedPath);
  const directoryUrl = `https://${storageApiHost}/${encodeURIComponent(storageZoneName)}/${queryPath ? `${queryPath}/` : ""}`;
  const response = await fetch(directoryUrl, {
    headers: { AccessKey: storageAccessKey, accept: "application/json" },
    next: { revalidate: 300 },
  });

  if (!response.ok) throw new Error(`Bunny Storage API ${response.status} for ${normalizedPath || "/"}`);

  const entries = (await response.json()) as BunnyStorageEntry[];
  const files: BunnyStorageFile[] = [];

  for (const entry of entries) {
    const entryPath = normalizedPath ? `${normalizedPath}/${entry.ObjectName}` : entry.ObjectName;
    if (entry.IsDirectory) {
      files.push(...(await listDirectory(course, `${entryPath}/`)));
    } else {
      files.push({
        path: entryPath,
        name: entry.ObjectName,
        size: entry.Length,
        updatedAt: entry.LastChanged,
        url: getFileUrl(course, entryPath),
      });
    }
  }

  return files;
};

export const getBunnyStorageFiles = async (course: BunnyNotesCourse) => {
  if (!isConfigured()) {
    return { files: [] as BunnyStorageFile[], configured: false };
  }

  const root = courseRoots[course];
  const files = await listDirectory(course, root);
  return {
    files: files.map((file) => {
      const path = file.path.slice(root.length + 1);
      return { ...file, path, url: getFileUrl(course, path) };
    }),
    configured: true,
  };
};

export const getBunnyStorageCourseRoot = (course: BunnyNotesCourse) => courseRoots[course];
