const bunnyLibraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
const bunnyTokenKey = process.env.BUNNY_STREAM_TOKEN_KEY;
const bunnyHostname = process.env.BUNNY_STREAM_CDN_HOSTNAME || "iframe.mediadelivery.net";

export const getBunnyEmbedUrl = (videoId: string, libraryId = bunnyLibraryId) => {
  if (!libraryId) return null;
  return `https://${bunnyHostname}/embed/${libraryId}/${videoId}`;
};

export const hasBunnyTokenAuth = () => Boolean(bunnyTokenKey);