import { useCallback, useEffect, useState } from "react";
import { getMediaByFolder, deleteMedia } from "../api/media";
import { toMediaFile } from "../utils/media";
import type { MediaFile } from "../components/MediaCard/MediaCard";

const PAGE_LIMIT = 20;

/**
 * Manages fetching, pagination, and deletion of media files in a folder.
 * refresh() is stable and safe to pass as a dependency to useMediaUpload.
 */
export function useMediaFolder(folderId: string | undefined) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (pageNum: number, replace: boolean) => {
      if (!folderId) return;
      const result = await getMediaByFolder(folderId, pageNum, PAGE_LIMIT);
      const mapped = result.data.map(toMediaFile);
      setFiles((prev) => (replace ? mapped : [...prev, ...mapped]));
      setTotalPages(result.pagination.totalPages);
    },
    [folderId]
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await fetchPage(1, true);
      setPage(1);
    } catch {
      setError("Failed to load files. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [fetchPage]);

  // Initial load and re-load when folder changes.
  useEffect(() => {
    setFiles([]);
    refresh();
  }, [refresh]);

  const loadMore = useCallback(async () => {
    const next = page + 1;
    setLoadingMore(true);
    try {
      await fetchPage(next, false);
      setPage(next);
    } finally {
      setLoadingMore(false);
    }
  }, [page, fetchPage]);

  const remove = useCallback(async (fileId: string) => {
    try {
      await deleteMedia(fileId);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch {
      setError("Failed to delete the file. Please try again.");
    }
  }, []);

  return {
    files,
    loading,
    loadingMore,
    error,
    hasMore: page < totalPages,
    refresh,
    loadMore,
    remove,
    clearError: () => setError(null),
  };
}
