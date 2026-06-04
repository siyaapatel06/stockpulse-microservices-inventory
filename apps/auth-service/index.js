const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const users = [];

app.get("/", (req, res) => {
  res.send("Auth Service Running 🚀");
});

app.get("/health", (req, res) => {
  res.json({
    service: "auth-service",
    status: "UP",
    port: 4000,
    timestamp: new Date().toISOString()
  });
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, password: hashedPassword });

  res.json({ message: "User registered" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Invalid password" });

  const token = jwt.sign({ email }, "secret", { expiresIn: "1h" });

  res.json({ token });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  jwt.verify(token, "secret", (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token." });
    req.user = user;
    next();
  });
}

app.get("/profile", authenticateToken, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});

app.listen(4000, () => {
  console.log("Auth Service running on port 4000");
});