import { Media } from "@/types/utilities";
import { create } from "zustand";

// Base type for the common properties of the upload status props
interface BaseStatusProps {
  file: Media;
}

// Specific type for when the status is 'uploaded'
interface UploadedStatusProps extends BaseStatusProps {
  status: "uploaded";
  id: string;
  url: string;
}

// Specific type for when the status is not 'uploaded'
interface NonUploadedStatusProps extends BaseStatusProps {
  status: Exclude<Media["uploadStatus"], "uploaded">;
}

type UploadStatusProps = UploadedStatusProps | NonUploadedStatusProps;

/**
 * Zustand state & action types
 */

interface MediaDropzoneState {
  files: Media[];
  preview: Media | null;
  uploading: boolean;
}

interface MediaDropzoneActions {
  addFiles: (files: Media[]) => void;
  removeFile: (file: Media) => void;
  setFileUploadStatus: (props: UploadStatusProps) => void;
  setPreview: (file: Media | null) => void;
  setPreviewCaption: (caption: string | undefined) => void;
  cleanup: () => void;
}

export const useMediaDropzoneStore = create<
  MediaDropzoneState & MediaDropzoneActions
>()((set, get) => ({
  files: [],
  preview: null,
  uploading: false,
  addFiles: (files) => set((state) => ({ files: [...state.files, ...files] })),
  removeFile: (fileToRemove) => {
    // Revoke the URL of the file to be removed
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    return set((state) => ({
      files: state.files.filter((m) => m.file.name !== fileToRemove.file.name),
    }));
  },
  setFileUploadStatus: (props) =>
    set((state) => ({
      files: state.files.map((media) => {
        if (media.preview === props.file.preview) {
          if (props.status === "uploaded") {
            return {
              ...media,
              uploadStatus: props.status,
              id: props.id,
              url: props.url,
            };
          } else {
            return {
              ...media,
              uploadStatus: props.status,
            };
          }
        }
        return media;
      }),
    })),
  setPreview: (file) => {
    if (!file) {
      return set({ preview: null });
    }

    const { files: files } = get();
    const index = files.findIndex((f) => f.preview === file?.preview);

    return set({
      preview: Object.assign(file, {
        index,
      }),
    });
  },
  setPreviewCaption: (caption) => {
    const { preview, files: files } = get();

    if (!preview) return;

    set({ preview: { ...preview, caption } });

    return set({
      files: files.map((file) => {
        if (file.preview === preview.preview) {
          return { ...file, caption };
        }
        return file;
      }),
    });
  },
  cleanup: () => {
    // Revoke all blob URLs when cleaning up
    const { files: files } = get();
    files.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    // Reset the state
    return set({ files: [], preview: null });
  },
}));
