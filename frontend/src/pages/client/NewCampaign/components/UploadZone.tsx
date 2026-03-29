import { useRef, useState } from "react";
import Icon from "../../../../components/Icon/Icon";
import MediaIcon from "../../../../assets/icons/media.svg?react";
import "./UploadZone.scss";

interface UploadZoneProps {
  files: File[];
  onChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
}

export function UploadZone({
  files,
  onChange,
  accept,
  multiple = false,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const newFiles = Array.from(incoming);
    onChange(multiple ? [...files, ...newFiles] : [newFiles[0]]);
  };

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="upload-zone">
      <div
        className={`upload-zone__drop${dragging ? " upload-zone__drop--dragging" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
      >
        <Icon svg={MediaIcon} size={24} />
        <p className="body-2">
          Drag & drop files here, or <strong>click to browse</strong>
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          style={{ display: "none" }}
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <ul className="upload-zone__list">
          {files.map((file, i) => (
            <li key={i} className="upload-zone__item">
              <span className="upload-zone__item-name">{file.name}</span>
              <button
                type="button"
                className="upload-zone__item-remove"
                onClick={() => removeFile(i)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
