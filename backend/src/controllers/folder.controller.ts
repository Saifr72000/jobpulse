import type { Request, Response, NextFunction } from "express";
import * as folderService from "../services/folder.service.js";
import { User } from "../models/user.model.js";

interface AuthenticatedRequest extends Request {
  user?: { userId: string };
}

export const createFolder = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const user = await User.findById(userId).select("company").lean();
    if (!user?.company) {
      res.status(404).json({ error: "User has no company" });
      return;
    }

    const { name } = req.body as { name: string };
    const folder = await folderService.createFolder(name, user.company.toString(), userId);

    res.status(201).json(folder);
  } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate key")) {
      res.status(409).json({ error: "A folder with this name already exists" });
      return;
    }
    next(error);
  }
};

export const getFoldersByCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { companyId } = req.params;
    const folders = await folderService.getFoldersByCompany(companyId as string);
    res.status(200).json(folders);
  } catch (error) {
    next(error);
  }
};

export const renameFolder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name } = req.body as { name: string };

    const folder = await folderService.renameFolder(id as string, name);
    if (!folder) {
      res.status(404).json({ error: "Folder not found" });
      return;
    }

    res.status(200).json(folder);
  } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate key")) {
      res.status(409).json({ error: "A folder with this name already exists" });
      return;
    }
    next(error);
  }
};

export const deleteFolder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await folderService.deleteFolder(id as string);
    res.status(200).json({ message: "Folder deleted. Files moved to root." });
  } catch (error) {
    if (error instanceof Error && error.message === "Folder not found") {
      res.status(404).json({ error: error.message });
      return;
    }
    next(error);
  }
};
