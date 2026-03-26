import mongoose, {Document, Schema} from "mongoose";

export interface ICompany extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    orgNumber: number;
    address?: string;
    email: string;
    website?: string;
    valueCardBalance: number;
    createdAt: Date;
    updatedAt: Date;
}

const companySchema = new Schema<ICompany>({
      name: {
        type: String,
        required: true,
      },
      orgNumber: {
        type: Number,
        required: true,
      },
      address: {
        type: String,
      },
      email: {
        type: String,
        required: true,
      },
      website: {
        type: String,
      },
      valueCardBalance: {
        type: Number,
        default: 0,
        min: 0,
      },
    }, { timestamps: true });

export const Company = mongoose.model<ICompany>("Company", companySchema);