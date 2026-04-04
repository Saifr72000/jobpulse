export type UrlType = "image" | "youtube" | "vimeo" | "external";

export interface CreativeEmbed {
  type: UrlType;
  embedUrl?: string;
}

const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i;

function extractYoutubeId(url: URL): string | null {
  if (url.hostname === "youtu.be") {
    return url.pathname.slice(1) || null;
  }
  return url.searchParams.get("v");
}

function extractVimeoId(url: URL): string | null {
  const match = url.pathname.match(/\/(\d+)/);
  return match ? match[1] : null;
}

export function getCreativeEmbed(url: string): CreativeEmbed {
  if (!url) return { type: "external" };

  if (IMAGE_EXTENSIONS.test(url)) {
    return { type: "image" };
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { type: "external" };
  }

  const hostname = parsed.hostname.replace(/^www\./, "");

  if (hostname === "youtube.com" || hostname === "youtu.be") {
    const id = extractYoutubeId(parsed);
    if (id) {
      return {
        type: "youtube",
        embedUrl: `https://www.youtube.com/embed/${id}`,
      };
    }
  }

  if (hostname === "vimeo.com" || hostname === "player.vimeo.com") {
    // If it's already a player URL, use it as-is
    if (hostname === "player.vimeo.com") {
      return { type: "vimeo", embedUrl: parsed.href };
    }
    const id = extractVimeoId(parsed);
    if (id) {
      return {
        type: "vimeo",
        embedUrl: `https://player.vimeo.com/video/${id}`,
      };
    }
  }

  return { type: "external" };
}
