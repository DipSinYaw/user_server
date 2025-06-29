const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const PORT = process.env.PORT || 3000;
app.use(express.json());

let users = [
  { name: "alice", password: "alice123" },
  { name: "bob", password: "bob456" }
];

app.get("/api/users", (req, res) => {
  res.json(users.map(u => ({ name: u.name }))); // Don't expose passwords
});

app.post("/api/auth", (req, res) => {
  console.log("Received auth request:", req.body);
  const { name, password } = req.body;
  const found = users.find(u => u.name === name && u.password === password);
  res.status(200).json({ success: !!found });
});

app.post("/api/register", (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).json({ error: "Name and password required" });
  }
  if (users.find(u => u.name === name)) {
    return res.status(409).json({ error: "User already exists" });
  }
  users.push({ name, password });
  res.status(201).json({ message: "User registered" });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});