import { useEffect, useRef, useState } from "react";

interface UseWindowDragDropOptions {
  disabled?: boolean;
}

/**
 * Detects when a file is being dragged anywhere over the browser window.
 * Returns true from the moment the file enters the viewport until it is
 * dropped or leaves. The counter pattern prevents the flag from flickering
 * due to spurious dragleave events fired as the cursor moves between elements.
 */
export function useWindowDragDrop(options: UseWindowDragDropOptions = {}): boolean {
  const { disabled = false } = options;
  const [isDragActive, setIsDragActive] = useState(false);
  const counterRef = useRef(0);

  useEffect(() => {
    if (disabled) {
      counterRef.current = 0;
      setIsDragActive(false);
      return;
    }

    const onDragEnter = (e: DragEvent) => {
      if (!e.dataTransfer?.types.includes("Files")) return;
      counterRef.current++;
      if (counterRef.current === 1) setIsDragActive(true);
    };

    const onDragLeave = () => {
      counterRef.current = Math.max(0, counterRef.current - 1);
      if (counterRef.current === 0) setIsDragActive(false);
    };

    const onDrop = () => {
      counterRef.current = 0;
      setIsDragActive(false);
    };

    const onDragOver = (e: DragEvent) => e.preventDefault();

    window.addEventListener("dragenter", onDragEnter);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);
    window.addEventListener("dragover", onDragOver);

    return () => {
      window.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
      window.removeEventListener("dragover", onDragOver);
    };
  }, [disabled]);

  return isDragActive;
}
