import { createHash } from "crypto";

const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
const apiKey = process.env.BUNNY_STREAM_API_KEY; // Library -> API -> "API Key"
const tokenKey = process.env.BUNNY_STREAM_TOKEN_KEY; // Library -> Security -> token auth key
const embedHost = process.env.BUNNY_STREAM_CDN_HOSTNAME || "iframe.mediadelivery.net";
const API = "https://video.bunnycdn.com";

export type BunnyVideo = { id: string; title: string; seconds: number };
export type BunnyModule = { collectionId: string; title: string; section?: string; videos: BunnyVideo[] };

// Signed embed URL. The token key stays on the server.
export const getBunnyEmbedUrl = (videoId: string) => {
  if (!libraryId) return null;
  const base = `https://${embedHost}/embed/${libraryId}/${videoId}`;
  if (!tokenKey) return base;
  const expires = Math.floor(Date.now() / 1000) + 60 * 60 * 4; // valid for 4 hours
  const token = createHash("sha256").update(tokenKey + videoId + expires).digest("hex");
  return `${base}?token=${token}&expires=${expires}`;
};

const bunnyFetch = async (path: string) => {
  const res = await fetch(`${API}/library/${libraryId}${path}`, {
    headers: { AccessKey: apiKey ?? "", accept: "application/json" },
    next: { revalidate: 300 }, // re-check Bunny at most every 5 minutes
  });
  if (!res.ok) throw new Error(`Bunny API ${res.status} for ${path}`);
  return res.json();
};

// Videos in one collection, sorted by title. Name videos "01 - Intro", "02 - ..." to control order.
export const getCollectionModule = async (collectionId: string, titleOverride?: string): Promise<BunnyModule> => {
  const [videosRes, collection] = await Promise.all([
    bunnyFetch(`/videos?page=1&itemsPerPage=100&orderBy=title&collection=${collectionId}`),
    titleOverride ? Promise.resolve(null) : bunnyFetch(`/collections/${collectionId}`),
  ]);
  return {
    collectionId,
    title: titleOverride ?? collection?.name ?? "Module",
    videos: (videosRes.items ?? []).map((v: { guid: string; title: string; length: number }) => ({
      id: v.guid,
      title: v.title,
      seconds: v.length,
    })),
  };
};

export const hasBunnyApiKey = () => Boolean(libraryId && apiKey);