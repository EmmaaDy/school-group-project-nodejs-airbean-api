// routes/orders.js

import { Router } from "express";
import { placeOrder, getOrdersByCustomerId, getOrderByCartId } from "../controller/order.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Place order
router.post("/", placeOrder);

// Endpoint for fetching order history for a specific customer
router.get("/:customerId", authenticate, async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const orders = await getOrdersByCustomerId(customerId);
    if (orders) {
      res.json({ orders });
    } else {
      res.status(404).json({ message: "Order history not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching order history", error: error.message });
  }
});

// Endpoint for fetching order confirmation by cart ID
router.get("/confirmation/:cartId", async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const order = await getOrderByCartId(cartId);
    if (order) {
      // Calculate delivery time (20 minutes)
      const orderDate = new Date(order.date);
      const deliveryDate = new Date(orderDate.getTime() + 20 * 60000); // Convert to milliseconds
      // Format as HH:MM
      const deliveryTime = deliveryDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Return order with delivery time
      res.json({ ...order, deliveryTime });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error: error.message });
  }
});

export default router;
