import { useCallback, useState } from "react";
import { uploadFiles } from "../api/media";

/**
 * Handles uploading files to a folder.
 * Calls onSuccess() after a successful upload so the caller can refresh its list.
 */
export function useMediaUpload(
  folderId: string | undefined,
  onSuccess: () => Promise<void>
) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (files: File[]) => {
      if (!files.length) return;
      setUploading(true);
      setError(null);
      try {
        await uploadFiles(files, folderId);
        await onSuccess();
      } catch {
        setError("Upload failed. Please check the file type and size (max 5 MB).");
      } finally {
        setUploading(false);
      }
    },
    [folderId, onSuccess]
  );

  return { uploading, error, upload, clearError: () => setError(null) };
}
