import { Order, type IOrder, type OrderStatus } from "../models/order.model.js";
import { Company } from "../models/company.model.js";
import { User } from "../models/user.model.js";

const PACKAGE_CHANNEL_LIMITS: Record<string, number> = {
  basic: 3,
  medium: 5,
  deluxe: 7,
};

interface OrderAssetsInput {
  imageOption: string;
  leadAdDescription?: string;
  videoMaterials?: string;
  linkedinJobDescription?: string;
  linkedinScreeningQuestions?: string;
}

interface CreateOrderInput {
  orderType: string;
  package?: string;
  channels: string[];
  addons?: string[];
  campaignName: string;
  assets: OrderAssetsInput;
  targetAudience: string;
  additionalNotes?: string;
  paymentMethod: string;
  totalAmount: number;
}

export const createOrder = async (
  userId: string,
  input: CreateOrderInput
): Promise<IOrder> => {
  // Get user to find their company
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Get company details for denormalization
  const company = await Company.findById(user.company);
  if (!company) {
    throw new Error("Company not found");
  }

  // Enforce package channel limits
  if (input.orderType === "package" && input.package) {
    const limit = PACKAGE_CHANNEL_LIMITS[input.package];
    if (limit !== undefined && input.channels.length > limit) {
      throw new Error(
        `Package '${input.package}' allows a maximum of ${limit} channel(s). You selected ${input.channels.length}.`
      );
    }
  }

  const newOrder = new Order({
    company: company._id,
    companyName: company.name,
    orgNumber: company.orgNumber,
    orderedBy: user._id,
    orderType: input.orderType,
    package: input.package,
    channels: input.channels,
    addons: input.addons ?? [],
    campaignName: input.campaignName,
    assets: input.assets,
    targetAudience: input.targetAudience,
    additionalNotes: input.additionalNotes,
    paymentMethod: input.paymentMethod,
    totalAmount: input.totalAmount,
    status: "pending",
  });

  await newOrder.save();
  return newOrder;
};

export const getMyOrders = async (
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<{ orders: IOrder[]; total: number; page: number; limit: number }> => {
  // Get user to find their company
  const user = await User.findById(userId).lean();
  if (!user) {
    throw new Error("User not found");
  }

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ company: user.company })
      .select(
        "_id campaignName status channels package addons totalAmount paymentMethod paymentStatus createdAt"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments({ company: user.company }),
  ]);

  return { orders: orders as unknown as IOrder[], total, page, limit };
};

export const getOrderById = async (orderId: string): Promise<IOrder | null> => {
  return await Order.findById(orderId).populate("orderedBy", "firstName lastName email");
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<IOrder | null> => {
  return await Order.findByIdAndUpdate(orderId, { status }, { new: true });
};

export const deleteOrder = async (orderId: string): Promise<IOrder | null> => {
  return await Order.findByIdAndDelete(orderId);
};

export const getAllOrders = async (): Promise<IOrder[]> => {
  return await Order.find()
    .populate("orderedBy", "firstName lastName email")
    .sort({ createdAt: -1 });
};

export const getOrdersByCompany = async (companyId: string): Promise<IOrder[]> => {
  return await Order.find({ company: companyId })
    .populate("orderedBy", "firstName lastName email")
    .sort({ createdAt: -1 });
};
