import mongoose, { Document, Schema } from "mongoose";

export interface IFolder extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  companyId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const folderSchema = new Schema<IFolder>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Folder names must be unique within a company
folderSchema.index({ companyId: 1, name: 1 }, { unique: true });
folderSchema.index({ companyId: 1 });

export const Folder = mongoose.model<IFolder>("Folder", folderSchema);
