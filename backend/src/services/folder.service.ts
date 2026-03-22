import { Folder, type IFolder } from "../models/folder.model.js";
import { Media } from "../models/media.model.js";

export const createFolder = async (
  name: string,
  companyId: string,
  createdBy: string
): Promise<IFolder> => {
  const folder = new Folder({ name, companyId, createdBy });
  await folder.save();
  return folder;
};

export const getFoldersByCompany = async (companyId: string): Promise<IFolder[]> => {
  return await Folder.find({ companyId })
    .populate("createdBy", "firstName lastName")
    .sort({ name: 1 })
    .lean();
};

export const getFolderById = async (folderId: string): Promise<IFolder | null> => {
  return await Folder.findById(folderId).lean();
};

export const renameFolder = async (
  folderId: string,
  name: string
): Promise<IFolder | null> => {
  return await Folder.findByIdAndUpdate(folderId, { name }, { new: true });
};

/**
 * Deletes a folder and unassigns all media that referenced it (files move to root).
 */
export const deleteFolder = async (folderId: string): Promise<void> => {
  const folder = await Folder.findById(folderId);
  if (!folder) {
    throw new Error("Folder not found");
  }

  await Media.updateMany({ folderId }, { $unset: { folderId: "" } });
  await Folder.findByIdAndDelete(folderId);
};
