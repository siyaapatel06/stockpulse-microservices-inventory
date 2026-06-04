const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const INVENTORY_SERVICE_URL = "http://localhost:4001";

let orders = [];
let eventTimeline = [];

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, "secret", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }

    req.user = user;
    req.token = token;
    next();
  });
}

function addEvent(type, details) {
  const event = {
    id: eventTimeline.length + 1,
    type,
    details,
    createdAt: new Date().toISOString()
  };

  eventTimeline.push(event);
  console.log("EVENT:", event);
}

app.get("/", (req, res) => {
  res.send("Orders Service Running 🧾");
});

app.get("/health", (req, res) => {
  res.json({
    service: "orders-service",
    status: "UP",
    port: 4002,
    timestamp: new Date().toISOString()
  });
});

app.get("/orders", authenticateToken, (req, res) => {
  res.json(orders);
});

app.get("/events", (req, res) => {
  res.json(eventTimeline);
});

app.post("/orders", authenticateToken, async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    addEvent("ORDER_CREATED", {
      productId,
      quantity,
      requestedBy: req.user.email
    });

    const productsResponse = await axios.get(`${INVENTORY_SERVICE_URL}/products`);
    const products = productsResponse.data;

    const product = products.find(item => item.id === Number(productId));

    if (!product) {
      addEvent("ORDER_FAILED", {
        reason: "Product not found",
        productId
      });

      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      addEvent("ORDER_FAILED", {
        reason: "Not enough stock",
        productId,
        availableStock: product.stock,
        requestedQuantity: quantity
      });

      return res.status(400).json({
        message: "Not enough stock",
        availableStock: product.stock
      });
    }

    addEvent("STOCK_RESERVED", {
      productId,
      oldStock: product.stock,
      reservedQuantity: quantity,
      newStock: product.stock - quantity
    });

    await axios.put(
      `${INVENTORY_SERVICE_URL}/products/${productId}/stock`,
      { stock: product.stock - quantity },
      {
        headers: {
          Authorization: `Bearer ${req.token}`
        }
      }
    );

    addEvent("PAYMENT_SIMULATED", {
      status: "approved",
      amount: quantity * 25
    });

    const newOrder = {
      id: orders.length + 1,
      productId,
      productName: product.name,
      quantity,
      status: "CONFIRMED",
      orderedBy: req.user.email,
      createdAt: new Date().toISOString()
    };

    orders.push(newOrder);

    addEvent("ORDER_CONFIRMED", {
      orderId: newOrder.id,
      productName: product.name
    });

    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder
    });
  } catch (error) {
    addEvent("ORDER_FAILED", {
      reason: "Inventory service unavailable or internal error",
      error: error.message
    });

    res.status(500).json({
      message: "Order failed gracefully",
      error: error.message
    });
  }
});

app.listen(4002, () => {
  console.log("Orders Service running on port 4002");
});