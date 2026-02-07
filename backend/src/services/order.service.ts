import { Order, type IOrder, type OrderStatus } from "../models/order.model.js";
import { Company } from "../models/company.model.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";

interface OrderItemInput {
  productId: string;
  quantity: number;
}

export const createOrder = async (
  userId: string,
  items: OrderItemInput[],
  shippingAddress?: string,
  notes?: string
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

  // Get products and calculate totals
  const productIds = items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  if (products.length !== productIds.length) {
    throw new Error("One or more products not found");
  }

  // Build order items with denormalized data
  const orderItems = items.map((item) => {
    const product = products.find((p) => p._id.toString() === item.productId);
    if (!product) {
      throw new Error(`Product ${item.productId} not found`);
    }
    return {
      product: product._id,
      productName: product.name,
      quantity: item.quantity,
      priceAtPurchase: product.price,
    };
  });

  // Calculate total
  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.priceAtPurchase * item.quantity,
    0
  );

  const newOrder = new Order({
    company: company._id,
    companyName: company.name,
    orgNumber: company.orgNumber,
    orderedBy: user._id,
    items: orderItems,
    totalAmount,
    status: "pending",
    shippingAddress,
    notes,
  });

  await newOrder.save();
  return newOrder;
};

export const getOrderById = async (orderId: string): Promise<IOrder | null> => {
  return await Order.findById(orderId)
    .populate("orderedBy", "firstName lastName email")
    .populate("items.product", "name price");
};

export const getOrdersByCompany = async (companyId: string): Promise<IOrder[]> => {
  return await Order.find({ company: companyId })
    .populate("orderedBy", "firstName lastName email")
    .sort({ createdAt: -1 });
};

export const getOrdersByUser = async (userId: string): Promise<IOrder[]> => {
  return await Order.find({ orderedBy: userId }).sort({ createdAt: -1 });
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
