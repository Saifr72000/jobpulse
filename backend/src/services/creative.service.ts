import { Creative, type ICreative, type CreativeStatus } from "../models/creative.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";

interface CreateCreativeInput {
  orderId: string;
  headline: string;
  subline?: string;
  url?: string;
}

export const createCreative = async (
  uploadedByUserId: string,
  input: CreateCreativeInput
): Promise<ICreative> => {
  const order = await Order.findById(input.orderId).lean();
  if (!order) {
    throw new Error("Order not found");
  }

  const user = await User.findById(uploadedByUserId).lean();
  if (!user) {
    throw new Error("User not found");
  }

  const creative = new Creative({
    order: order._id,
    company: order.company,
    headline: input.headline,
    subline: input.subline,
    url: input.url,
    uploadedBy: user._id,
    status: "pending",
  });

  await creative.save();
  return creative;
};

export const getCreativesByOrder = async (orderId: string): Promise<ICreative[]> => {
  return await Creative.find({ order: orderId })
    .populate("uploadedBy", "firstName lastName")
    .sort({ createdAt: -1 })
    .lean() as unknown as ICreative[];
};

export const updateCreativeStatus = async (
  creativeId: string,
  status: CreativeStatus
): Promise<ICreative | null> => {
  return await Creative.findByIdAndUpdate(
    creativeId,
    { status },
    { new: true }
  );
};

export const deleteCreative = async (creativeId: string): Promise<ICreative | null> => {
  return await Creative.findByIdAndDelete(creativeId);
};
