const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

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
    next();
  });
}

let products = [
  {
    id: 1,
    name: "Wireless Mouse",
    sku: "WM-1001",
    category: "Electronics",
    stock: 25,
    lowStockThreshold: 10,
    warehouse: "San Jose Warehouse"
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    sku: "MK-2002",
    category: "Electronics",
    stock: 8,
    lowStockThreshold: 10,
    warehouse: "San Jose Warehouse"
  }
];

app.get("/", (req, res) => {
  res.send("Inventory Service Running 📦");
});

app.get("/health", (req, res) => {
  res.json({
    service: "inventory-service",
    status: "UP",
    port: 4001,
    timestamp: new Date().toISOString()
  });
});

app.get("/products", (req, res) => {
  res.json(products);
});

app.get("/products/low-stock", (req, res) => {
  const lowStockProducts = products.filter(
    product => product.stock <= product.lowStockThreshold
  );

  res.json({
    count: lowStockProducts.length,
    products: lowStockProducts
  });
});

app.post("/products", authenticateToken, (req, res) => {
  const { name, sku, category, stock, lowStockThreshold, warehouse } = req.body;

  const newProduct = {
    id: products.length + 1,
    name,
    sku,
    category,
    stock,
    lowStockThreshold,
    warehouse,
    createdBy: req.user.email
  };

  products.push(newProduct);

  res.status(201).json({
    message: "Product created",
    product: newProduct
  });
});

app.put("/products/:id/stock", authenticateToken, (req, res) => {
  const productId = Number(req.params.id);
  const { stock } = req.body;

  const product = products.find(product => product.id === productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  product.stock = stock;
  product.updatedBy = req.user.email;

  res.json({
    message: "Stock updated",
    product
  });
});

app.delete("/products/:id", authenticateToken, (req, res) => {
  const productId = Number(req.params.id);
  products = products.filter(product => product.id !== productId);

  res.json({
    message: "Product deleted",
    deletedBy: req.user.email
  });
});

app.listen(4001, () => {
  console.log("Inventory Service running on port 4001");
});