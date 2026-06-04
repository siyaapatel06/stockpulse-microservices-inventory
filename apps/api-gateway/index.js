const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || "http://localhost:4000";
const INVENTORY_SERVICE = process.env.INVENTORY_SERVICE_URL || "http://localhost:4001";
const ORDERS_SERVICE = process.env.ORDERS_SERVICE_URL || "http://localhost:4002";

app.get("/", (req, res) => {
  res.json({
    message: "StockPulse API Gateway Running 🚦",
    routes: {
      auth: "/api/auth",
      inventory: "/api/inventory",
      orders: "/api/orders",
      health: "/api/health"
    }
  });
});

app.get("/api/health", async (req, res) => {
  const services = {
    auth: AUTH_SERVICE,
    inventory: INVENTORY_SERVICE,
    orders: ORDERS_SERVICE
  };

  const results = {};

  for (const [name, url] of Object.entries(services)) {
    try {
      const response = await axios.get(`${url}/health`);
      results[name] = response.data;
    } catch (error) {
      results[name] = {
        service: `${name}-service`,
        status: "DOWN",
        error: error.message
      };
    }
  }

  res.json({
    gateway: "UP",
    services: results
  });
});

/*
AUTH ROUTES
*/

app.post("/api/auth/register", async (req, res) => {
  try {
    const response = await axios.post(
      `${AUTH_SERVICE}/register`,
      req.body
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Auth service error",
      error: error.message
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const response = await axios.post(
      `${AUTH_SERVICE}/login`,
      req.body
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Auth service error",
      error: error.message
    });
  }
});

/*
INVENTORY ROUTES
*/

app.get("/api/inventory/products", async (req, res) => {
  try {
    const response = await axios.get(
      `${INVENTORY_SERVICE}/products`
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Inventory service error",
      error: error.message
    });
  }
});

app.get("/api/inventory/low-stock", async (req, res) => {
  try {
    const response = await axios.get(
      `${INVENTORY_SERVICE}/products/low-stock`
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Inventory service error",
      error: error.message
    });
  }
});

/*
ORDERS ROUTES
*/

app.post("/api/orders", async (req, res) => {
  try {
    const response = await axios.post(
      `${ORDERS_SERVICE}/orders`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Orders service error",
      error: error.message
    });
  }
});

app.get("/api/orders/events", async (req, res) => {
  try {
    const response = await axios.get(
      `${ORDERS_SERVICE}/events`
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: "Orders service error",
      error: error.message
    });
  }
});

app.listen(4003, () => {
  console.log("API Gateway running on port 4003");
});