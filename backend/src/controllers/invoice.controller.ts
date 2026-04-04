import type { Request, Response, NextFunction } from "express";
import { Order } from "../models/order.model.js";
import { generateInvoicePdf } from "../services/invoice.service.js";

export const downloadInvoice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate(
      "orderedBy",
      "firstName lastName email"
    );

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="invoice-${id}.pdf"`
    );

    generateInvoicePdf(order, res);
  } catch (error) {
    console.error("[Invoice] Error generating PDF:", error);
    next(error);
  }
};
